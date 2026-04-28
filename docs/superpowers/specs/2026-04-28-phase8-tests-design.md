# Phase 8 — Tests Design

## Overview

Add a complete test suite covering all three tiers: pure-function unit tests, Zod schema validation tests, and component/store integration tests. No test framework exists yet — this spec covers setup through execution.

---

## 1. Framework Setup

**Install (dev dependencies):**
- `vitest` — test runner
- `@vitejs/plugin-react` — JSX transform for Vitest
- `@testing-library/react` — component rendering
- `@testing-library/user-event` — realistic user interactions
- `@testing-library/jest-dom` — custom DOM matchers (`toBeInTheDocument`, etc.)
- `jsdom` — browser environment simulation
- `msw` — mock HTTP requests in component/hook tests

**Config files:**
- `vitest.config.ts` at repo root — sets `environment: 'jsdom'`, resolves `@/` path alias from `tsconfig.json`, points `setupFiles` to `test/setup.ts`
- `test/setup.ts` — imports `@testing-library/jest-dom`; module-level mocks for `next/navigation` and `sonner`
- `test/render.tsx` — shared render helper that wraps with a fresh `QueryClientProvider` per test
- `test/fixtures/` — shared raw API shape fixtures used by both mapper and component tests

**package.json scripts:**
```json
"test": "vitest",
"test:ui": "vitest --ui",
"test:coverage": "vitest --coverage"
```

---

## 2. Dead Code Removal

`features/profile/components/ProfileContent.tsx` is never imported anywhere — the real profile page (`app/profile/page.tsx`) has its own inline implementation. Delete this file before writing tests.

---

## 3. Tier 1 — Mapper + Utility Tests

Pure functions, no mocking required.

### `features/restaurants/mapper.test.ts`
Tests for: `toRestaurant`, `toMenuItemDetail`, `toReviewDetail`, `toRestaurantDetail`

Cases:
- `toRestaurant` maps `star` → `rating`, preserves all other fields
- `toRestaurant` handles `null` category
- `toRestaurant` omits `distance` when not present
- `toMenuItemDetail` maps `foodName` → `name`
- `toMenuItemDetail` coerces unknown `type` value to `'food'`
- `toMenuItemDetail` preserves `'drink'` type correctly
- `toReviewDetail` maps `star` → `rating`
- `toRestaurantDetail` maps nested `menus` and `reviews` arrays
- `toRestaurantDetail` drops `averageRating` and `coordinates` from output

### `features/cart/mapper.test.ts`
Tests for: `toCart` (which exercises private `toCartGroup` and `toCartItem`)

Cases:
- `toCart` maps `foodName` → `name` on menu items
- `toCart` preserves `subtotal`, `itemTotal`, `quantity`
- `toCart` with multiple groups returns correct group count
- `toCart` with empty `cart` array returns empty `groups`
- `toCart` passes `summary` through unchanged

### `lib/utils.test.ts`
Tests for: `cn()`

Cases:
- Merges multiple class strings
- Resolves Tailwind conflicts (last one wins: `p-2 p-4` → `p-4`)
- Handles conditional classes (`false` values dropped)
- Handles `undefined` and `null` inputs gracefully

---

## 4. Tier 2 — Zod Schema Tests

Schemas are extracted from page components into co-located schema files so they can be imported without pulling in Next.js client-only runtime code.

### Extraction plan
| Page file | New schema file |
|---|---|
| `app/(auth)/login/page.tsx` | `app/(auth)/login/login.schema.ts` |
| `app/(auth)/register/page.tsx` | `app/(auth)/register/register.schema.ts` |
| `app/profile/page.tsx` | `app/profile/profile.schema.ts` |
| `app/checkout/page.tsx` | `app/checkout/checkout.schema.ts` |

Each page imports its schema from the new file — no logic change, just extraction.

### `login.schema.test.ts`
- Valid email + password passes
- Empty email → `'Email is required'`
- Invalid email format → `'Invalid email'`
- Empty password → `'Password is required'`
- `rememberMe` is optional (undefined passes)

### `register.schema.test.ts`
- Valid full input passes
- Name shorter than 2 chars → `'Name must be at least 2 characters'`
- Invalid email → `'Invalid email'`
- Empty phone → `'Phone number is required'`
- Password shorter than 6 chars → `'Password must be at least 6 characters'`
- Mismatched passwords → `'Passwords do not match'` on `confirmPassword`
- Matching passwords passes cross-field check

### `profile.schema.test.ts`
- Valid name + email passes
- Name shorter than 2 chars → error
- Invalid email → error
- `phone` is optional (omitted passes)

### `checkout.schema.test.ts`
- Valid full input passes
- `deliveryAddress` shorter than 5 chars → `'Delivery address is required'`
- `phone` shorter than 5 chars → `'Phone number is required'`
- Empty `paymentMethod` → `'Select a payment method'`
- `notes` is optional (omitted passes)

---

## 5. Tier 3 — Component + Store Tests

### `store/useAuthStore.test.ts`
No component rendering needed — test via `act()` + `renderHook`.

Cases:
- Initial state: `user` is `null`, `token` is `null`
- `setAuth(user, token)` sets both values
- `clearAuth()` resets both to `null`
- `isAuthenticated` is `false` initially, `true` after `setAuth`, `false` again after `clearAuth`

### `features/auth/components/AuthFormInput.test.tsx`
- Renders input with correct `placeholder`
- Renders error message `<p>` when `error` prop is provided
- Does not render error element when `error` is undefined

### `app/(auth)/login/page.test.tsx`
Uses shared `render` helper. Mocks `useLogin` from `@/features/auth/hooks/useAuth`.

Cases:
- Renders email input, password input, and submit button
- Submitting empty form shows inline validation errors (does not call `mutate`)
- Submitting with valid email + password calls `mutate` with correct payload
- When `error` is set on the hook, renders the API error `role="alert"` div

### `app/(auth)/register/page.test.tsx`
Cases:
- Submitting with mismatched passwords shows `'Passwords do not match'` error
- Submitting with all valid fields calls `mutate` with `{ name, email, phone, password }` (no `confirmPassword`)
- `confirmPassword` field is excluded from the mutation payload

---

## 6. Mocking Conventions

| Dependency | Strategy |
|---|---|
| `next/navigation` (`useRouter`, `useSearchParams`, `usePathname`) | `vi.mock` in `test/setup.ts` — returns stub router with `push: vi.fn()` |
| `sonner` | `vi.mock` in `test/setup.ts` — `toast.error` and `toast.success` are `vi.fn()` no-ops |
| TanStack Query hooks (in component tests) | `vi.mock` the hook module, return controlled `{ mutate, isPending, error }` |
| HTTP (if testing actual hooks) | `msw` handlers in `test/fixtures/handlers.ts` |

---

## 7. File Layout After Implementation

```
test/
  setup.ts
  render.tsx
  fixtures/
    restaurant.fixture.ts
    cart.fixture.ts
    handlers.ts           ← msw handlers
features/
  restaurants/
    mapper.ts
    mapper.test.ts
  cart/
    mapper.ts
    mapper.test.ts
lib/
  utils.ts
  utils.test.ts
store/
  useAuthStore.ts
  useAuthStore.test.ts
app/
  (auth)/
    login/
      page.tsx
      login.schema.ts     ← extracted
      login.schema.test.ts
      page.test.tsx
    register/
      page.tsx
      register.schema.ts  ← extracted
      register.schema.test.ts
      page.test.tsx
  profile/
    page.tsx
    profile.schema.ts     ← extracted
    profile.schema.test.ts
  checkout/
    page.tsx
    checkout.schema.ts    ← extracted
    checkout.schema.test.ts
```
