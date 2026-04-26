# Foody V2 — Project Specification

## What we're building

Portfolio-grade restaurant ordering frontend. Backend is fixed and deployed at https://be-restaurant-production.up.railway.app. This repo is frontend-only. Goal: a production-quality reference implementation showcasing senior-level Next.js + TypeScript work.

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript strict |
| Styling | Tailwind CSS v4 |
| Server state | TanStack Query v5 |
| Client state | Zustand (persisted for auth) |
| HTTP | Axios with request/response interceptors |
| Forms | React Hook Form + Zod |
| Package manager | npm (already installed) |
| Testing | Vitest + React Testing Library; Playwright for E2E |

No Redux anywhere in the final codebase.

---

## Pages & Routes

| Page | Route | Auth required |
|------|-------|---------------|
| Home / Restaurant listing | `/` | No (recommended section requires auth) |
| All restaurants + filters | `/restaurants` | No |
| Restaurant detail | `/restaurants/[id]` | No |
| Login | `/login` | No |
| Register | `/register` | No |
| My Cart | `/cart` | Yes |
| Checkout | `/checkout` | Yes |
| Payment success | `/checkout/success` | Yes |
| My Orders | `/orders` | Yes |
| Profile | `/profile` | Yes |
| Delivery Address | `/profile` (section) | Yes |

---

## API contract

Source of truth: `./app/api/swagger.json`
Base URL: https://be-restaurant-production.up.railway.app

### All endpoints

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| POST | `/api/auth/register` | No | body: name/email/phone/password → `{data:{user,token}}` |
| POST | `/api/auth/login` | No | body: email/password → `{data:{user,token}}` |
| GET | `/api/auth/profile` | Bearer | → `{data: User}` |
| PUT | `/api/auth/profile` | Bearer | **multipart/form-data** — name/email/phone/avatar file |
| GET | `/api/cart` | Bearer | → `{data:{cart:[{restaurant,items,subtotal}],summary}}` |
| POST | `/api/cart` | Bearer | body: `{restaurantId,menuId,quantity}` |
| PUT | `/api/cart/{id}` | Bearer | body: `{quantity}` |
| DELETE | `/api/cart/{id}` | Bearer | remove one item |
| DELETE | `/api/cart` | Bearer | clear entire cart |
| POST | `/api/order/checkout` | Bearer | body: `{restaurants,deliveryAddress,phone,paymentMethod,notes}` |
| GET | `/api/order/my-order` | Bearer | params: status/page/limit |
| GET | `/api/resto` | No | params: location/range/priceMin/priceMax/rating/category/page/limit |
| GET | `/api/resto/nearby` | Bearer | requires user lat/long set on profile |
| GET | `/api/resto/recommended` | Bearer | → `{data:{recommendations:[...],message}}` |
| GET | `/api/resto/best-seller` | No | sorted by star desc |
| GET | `/api/resto/search` | No | param: q |
| GET | `/api/resto/{id}` | No | params: limitMenu/limitReview |
| POST | `/api/review` | Bearer | body: `{transactionId,restaurantId,star,comment?,menuIds?}` |
| GET | `/api/review/my-reviews` | Bearer | paginated |
| GET | `/api/review/restaurant/{restaurantId}` | Bearer | paginated |

### Confirmed API gotchas

- Swagger `Menu` schema uses `food_name` (snake_case); actual responses return `foodName` (camelCase) — use camelCase in all types
- `star` is the rating field, not `rating` — the filter query param is `rating` but the field returned is `star`
- Order status after checkout is always `"done"` — the My Orders tabs are display labels
- Transaction status enum: `preparing | on_the_way | delivered | done | cancelled`
- Profile update is `multipart/form-data` (not JSON)
- Review POST requires `transactionId` (string) from the order — stored in order objects from `GET /api/order/my-order`
- Delivery address on checkout is a free-text string (`deliveryAddress`) + `phone` — pre-fill from user profile, allow inline override
- Payment methods (BNI/BRI/BCA/Mandiri) are frontend-hardcoded — no API for them
- `GET /api/resto` real response includes a `filters` object inside `data` not shown in swagger
- Cart items use `foodName` (camelCase) in `menu` sub-object

---

## Architecture decisions

### State management
- **Server state**: TanStack Query for all API data (restaurants, cart, orders, profile)
- **Client state**: Zustand only — auth store (persisted), UI-only state (modal open/close, filter panel, active tab)
- **No Redux** anywhere

### Auth
- Token stored in Zustand persisted store (`useAuthStore`)
- Auto-attach Bearer token via axios request interceptor (reads from Zustand store)
- 401 response interceptor: clear auth store + redirect to `/login` for protected routes
- Protected routes: middleware or layout-level guard

### Cart
- Cart state lives on the server (`GET /api/cart`)
- TanStack Query manages fetch/cache/invalidation
- Add/update/remove via mutations that invalidate `['cart']` query key
- No local cart store

### Forms
- React Hook Form + Zod resolver
- Zod schema co-located with form component
- Submit button disabled while mutation is pending
- Inline error display with `aria-invalid` + `aria-describedby`

### Folder structure (as built)

```
app/                          ← Next.js routes
  (auth)/login/page.tsx
  (auth)/register/page.tsx
  cart/page.tsx
  checkout/page.tsx
  checkout/success/page.tsx
  orders/page.tsx
  profile/page.tsx
  restaurants/page.tsx
  restaurants/[id]/page.tsx
  design/                     ← Figma exports (reference only)
  api/swagger.json
components/
  layout/                     ← Navbar, Footer, MainLayout, HeroSearch
  layout/ui/                  ← Button, Input, Modal, SearchInput, Tabs
features/
  auth/                       ← components, hooks, services, types
  cart/                       ← components, hooks, services, types
  checkout/                   ← components, hooks, services, types
  orders/                     ← components, hooks, services, types
  profile/                    ← components, hooks, services, types
  restaurants/                ← components, hooks, services, types
lib/
  apiClient.ts                ← axios instance + interceptors
  queryClient.ts              ← TanStack Query client
  utils.ts
constants/
  api.ts                      ← API_BASE_URL, API_ENDPOINTS
  routes.ts
store/
  useAuthStore.ts             ← Zustand persisted auth store (replaces Redux)
types/
  api.ts                      ← shared API wrapper types only
```

### Naming conventions
- Components: `PascalCase.tsx`
- Hooks: `use` prefix, e.g. `useRestaurants.ts`
- Types in `features/*/types.ts`: API shapes directly (no `Api*` prefix needed since they are per-feature)
- Zustand stores: `use*Store.ts`

### TanStack Query
- Query keys: hierarchical arrays — `['restaurants', filters]`, `['restaurant', id]`, `['cart']`, `['orders', status]`
- `staleTime: 60_000` default
- Mutations invalidate related queries on success
- `placeholderData: keepPreviousData` for paginated lists

---

## Success criteria

A reviewer opening this repo should be able to say:

1. **It works end-to-end** — browse restaurants → add to cart → checkout → see order → leave review
2. **Types are strict** — `tsc --noEmit` exits clean, zero `any`
3. **UI matches design** — pixel-faithful to `app/design/*.png` on both mobile and desktop
4. **Code is senior-level** — no Redux, no local cart duplication, no `any`, no console.logs, no commented-out code
5. **Accessible** — keyboard navigable, WCAG 2.1 AA, screen-reader friendly
6. **Tested** — mappers + utils unit tested, forms component tested, critical path E2E tested
7. **Fast** — Lighthouse mobile: Perf ≥ 90, A11y ≥ 95, Best Practices = 100, SEO ≥ 95

---

## Quality gates (must all pass before "done")

- [ ] `tsc --noEmit` — zero errors, strict mode
- [ ] ESLint — zero warnings
- [ ] All unit + component tests pass
- [ ] E2E critical path passes (auth → browse → cart → checkout → orders)
- [ ] Lighthouse mobile: Perf ≥ 90 / A11y ≥ 95 / BP = 100 / SEO ≥ 95
- [ ] WCAG 2.1 AA — manually verified (keyboard, focus, contrast, screen reader)
- [ ] Live demo deployed on Vercel and functional
- [ ] README with live demo link + screenshots
