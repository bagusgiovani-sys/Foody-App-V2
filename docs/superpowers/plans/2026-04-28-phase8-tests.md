# Phase 8 — Tests Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up Vitest and write a full test suite covering pure-function mappers, Zod validation schemas, the auth Zustand store, and the login/register page components.

**Architecture:** Vitest with jsdom for unit and component tests. Schemas extracted from page files into co-located `*.schema.ts` files so they're importable without pulling in Next.js runtime. Component tests mock TanStack Query hooks at module level and use a shared `QueryClientProvider` wrapper from `test/render.tsx`. No real HTTP is made.

**Tech Stack:** Vitest, @vitejs/plugin-react, @testing-library/react, @testing-library/user-event, @testing-library/jest-dom, jsdom

---

## File Map

**New files:**
- `vitest.config.ts` — Vitest config: jsdom env, `@/` alias, setupFiles
- `test/setup.ts` — jest-dom + global mocks (next/navigation, next/link, next/image, sonner)
- `test/render.tsx` — custom render helper wrapping with QueryClientProvider
- `test/fixtures/restaurant.fixture.ts` — raw ApiRestaurant / ApiRestaurantDetail shapes
- `test/fixtures/cart.fixture.ts` — raw ApiCartResponse shape
- `lib/utils.test.ts`
- `features/restaurants/mapper.test.ts`
- `features/cart/mapper.test.ts`
- `app/(auth)/login/login.schema.ts` — extracted from page.tsx
- `app/(auth)/login/login.schema.test.ts`
- `app/(auth)/login/page.test.tsx`
- `app/(auth)/register/register.schema.ts` — extracted from page.tsx
- `app/(auth)/register/register.schema.test.ts`
- `app/(auth)/register/page.test.tsx`
- `app/profile/profile.schema.ts` — extracted from page.tsx
- `app/profile/profile.schema.test.ts`
- `app/checkout/checkout.schema.ts` — extracted from page.tsx
- `app/checkout/checkout.schema.test.ts`
- `store/useAuthStore.test.ts`

**Deleted files:**
- `features/profile/components/ProfileContent.tsx` — dead code, never imported anywhere

**Modified files:**
- `package.json` — add `"test"` and `"test:watch"` scripts
- `app/(auth)/login/page.tsx` — import schema from `./login.schema`
- `app/(auth)/register/page.tsx` — import schema from `./register.schema`
- `app/profile/page.tsx` — import schema from `./profile.schema`
- `app/checkout/page.tsx` — import schema from `./checkout.schema`

---

### Task 1: Install dependencies and create vitest.config.ts

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Install test dependencies**

```bash
npm install --save-dev vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

Expected: packages appear in `devDependencies`, no peer dependency errors.

- [ ] **Step 2: Create vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

- [ ] **Step 3: Add test scripts to package.json**

In the `"scripts"` object in `package.json`, add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Verify config loads without errors**

```bash
npm test
```

Expected: `No test files found` or exits cleanly — no module resolution errors.

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts package.json package-lock.json
git commit -m "chore: add Vitest test infrastructure"
```

---

### Task 2: Create shared test utilities

**Files:**
- Create: `test/setup.ts`
- Create: `test/render.tsx`

- [ ] **Step 1: Create test/setup.ts**

```ts
import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement('a', { href }, children),
}));

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) =>
    React.createElement('img', props),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
  Toaster: () => null,
}));
```

- [ ] **Step 2: Create test/render.tsx**

```tsx
import React from 'react';
import { render as rtlRender, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = makeQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export function render(ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return rtlRender(ui, { wrapper: Providers, ...options });
}

export * from '@testing-library/react';
```

- [ ] **Step 3: Commit**

```bash
git add test/
git commit -m "chore: add shared test utilities (setup mocks, render wrapper)"
```

---

### Task 3: Create test fixtures

**Files:**
- Create: `test/fixtures/restaurant.fixture.ts`
- Create: `test/fixtures/cart.fixture.ts`

- [ ] **Step 1: Create restaurant fixture**

```ts
// test/fixtures/restaurant.fixture.ts
import type {
  ApiRestaurant,
  ApiRestaurantDetail,
  ApiMenuItemDetail,
  ApiReviewDetail,
} from '@/features/restaurants/types';

export const apiRestaurant: ApiRestaurant = {
  id: 1,
  name: 'Warung Soto',
  star: 4.5,
  place: 'Jakarta Selatan',
  logo: 'https://example.com/logo.jpg',
  images: ['https://example.com/img.jpg'],
  category: 'Indonesian',
  reviewCount: 12,
  menuCount: 8,
  priceRange: { min: 15000, max: 50000 },
};

export const apiMenuItem: ApiMenuItemDetail = {
  id: 1,
  foodName: 'Soto Ayam',
  price: 25000,
  type: 'food',
  image: 'https://example.com/soto.jpg',
};

export const apiReview: ApiReviewDetail = {
  id: 1,
  star: 5,
  comment: 'Sangat enak!',
  createdAt: '2024-01-15T10:00:00Z',
  user: { id: 1, name: 'Alice', avatar: 'https://example.com/avatar.jpg' },
};

export const apiRestaurantDetail: ApiRestaurantDetail = {
  id: 1,
  name: 'Warung Soto',
  star: 4.5,
  averageRating: 4.3,
  place: 'Jakarta Selatan',
  coordinates: { lat: -6.2, long: 106.8 },
  logo: 'https://example.com/logo.jpg',
  images: ['https://example.com/img.jpg'],
  category: 'Indonesian',
  totalMenus: 8,
  totalReviews: 12,
  menus: [apiMenuItem],
  reviews: [apiReview],
};
```

- [ ] **Step 2: Create cart fixture**

```ts
// test/fixtures/cart.fixture.ts
import type { ApiCartResponse } from '@/features/cart/types';

export const apiCartResponse: ApiCartResponse = {
  cart: [
    {
      restaurant: { id: 1, name: 'Warung Soto', logo: 'https://example.com/logo.jpg' },
      items: [
        {
          id: 10,
          menu: {
            id: 1,
            foodName: 'Soto Ayam',
            price: 25000,
            type: 'food',
            image: 'https://example.com/soto.jpg',
          },
          quantity: 2,
          itemTotal: 50000,
        },
      ],
      subtotal: 50000,
    },
  ],
  summary: { totalItems: 2, totalPrice: 50000, restaurantCount: 1 },
};
```

- [ ] **Step 3: Commit**

```bash
git add test/fixtures/
git commit -m "chore: add test fixtures (restaurant, cart)"
```

---

### Task 4: Delete dead code and write utils tests

**Files:**
- Delete: `features/profile/components/ProfileContent.tsx`
- Create: `lib/utils.test.ts`

- [ ] **Step 1: Confirm ProfileContent.tsx is not imported anywhere**

```bash
grep -r "ProfileContent" . --include="*.ts" --include="*.tsx" | grep -v node_modules
```

Expected: only the file itself matches (definition only). If any other file imports it, investigate before deleting.

- [ ] **Step 2: Delete the file**

```bash
git rm "features/profile/components/ProfileContent.tsx"
```

- [ ] **Step 3: Write lib/utils.test.ts**

```ts
// lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('merges multiple class strings', () => {
    expect(cn('px-2', 'py-3')).toBe('px-2 py-3');
  });

  it('resolves Tailwind conflicts — last one wins', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('drops false conditional classes', () => {
    expect(cn('base', false && 'conditional')).toBe('base');
  });

  it('handles undefined inputs', () => {
    expect(cn('base', undefined)).toBe('base');
  });

  it('returns empty string with no arguments', () => {
    expect(cn()).toBe('');
  });
});
```

- [ ] **Step 4: Run tests**

```bash
npm test
```

Expected: 5 tests pass in `lib/utils.test.ts`.

- [ ] **Step 5: Commit**

```bash
git add lib/utils.test.ts
git commit -m "test: utils cn() tests; remove dead ProfileContent component"
```

---

### Task 5: Write restaurant mapper tests

**Files:**
- Create: `features/restaurants/mapper.test.ts`

- [ ] **Step 1: Write the tests**

```ts
// features/restaurants/mapper.test.ts
import { describe, it, expect } from 'vitest';
import { toRestaurant, toMenuItemDetail, toReviewDetail, toRestaurantDetail } from './mapper';
import {
  apiRestaurant,
  apiMenuItem,
  apiReview,
  apiRestaurantDetail,
} from '@/test/fixtures/restaurant.fixture';

describe('toRestaurant', () => {
  it('maps star to rating', () => {
    const result = toRestaurant(apiRestaurant);
    expect(result.rating).toBe(4.5);
    expect(result).not.toHaveProperty('star');
  });

  it('preserves id, name, place, category, reviewCount, menuCount, priceRange', () => {
    const result = toRestaurant(apiRestaurant);
    expect(result.id).toBe(1);
    expect(result.name).toBe('Warung Soto');
    expect(result.place).toBe('Jakarta Selatan');
    expect(result.category).toBe('Indonesian');
    expect(result.reviewCount).toBe(12);
    expect(result.menuCount).toBe(8);
    expect(result.priceRange).toEqual({ min: 15000, max: 50000 });
  });

  it('handles null category', () => {
    expect(toRestaurant({ ...apiRestaurant, category: null }).category).toBeNull();
  });

  it('omits distance when not present in source', () => {
    expect(toRestaurant(apiRestaurant).distance).toBeUndefined();
  });

  it('passes through distance when present', () => {
    expect(toRestaurant({ ...apiRestaurant, distance: 1.5 }).distance).toBe(1.5);
  });
});

describe('toMenuItemDetail', () => {
  it('maps foodName to name', () => {
    const result = toMenuItemDetail(apiMenuItem);
    expect(result.name).toBe('Soto Ayam');
    expect(result).not.toHaveProperty('foodName');
  });

  it('preserves food type', () => {
    expect(toMenuItemDetail(apiMenuItem).type).toBe('food');
  });

  it('preserves drink type', () => {
    expect(toMenuItemDetail({ ...apiMenuItem, type: 'drink' }).type).toBe('drink');
  });

  it('coerces unknown type to food', () => {
    expect(toMenuItemDetail({ ...apiMenuItem, type: 'snack' }).type).toBe('food');
  });

  it('preserves id, price, and image', () => {
    const result = toMenuItemDetail(apiMenuItem);
    expect(result.id).toBe(1);
    expect(result.price).toBe(25000);
    expect(result.image).toBe('https://example.com/soto.jpg');
  });
});

describe('toReviewDetail', () => {
  it('maps star to rating', () => {
    const result = toReviewDetail(apiReview);
    expect(result.rating).toBe(5);
    expect(result).not.toHaveProperty('star');
  });

  it('preserves comment, createdAt, and user', () => {
    const result = toReviewDetail(apiReview);
    expect(result.comment).toBe('Sangat enak!');
    expect(result.createdAt).toBe('2024-01-15T10:00:00Z');
    expect(result.user.name).toBe('Alice');
  });
});

describe('toRestaurantDetail', () => {
  it('maps star to rating', () => {
    expect(toRestaurantDetail(apiRestaurantDetail).rating).toBe(4.5);
  });

  it('drops averageRating from output', () => {
    expect(toRestaurantDetail(apiRestaurantDetail)).not.toHaveProperty('averageRating');
  });

  it('drops coordinates from output', () => {
    expect(toRestaurantDetail(apiRestaurantDetail)).not.toHaveProperty('coordinates');
  });

  it('maps nested menus — foodName becomes name', () => {
    const result = toRestaurantDetail(apiRestaurantDetail);
    expect(result.menus[0].name).toBe('Soto Ayam');
    expect(result.menus[0]).not.toHaveProperty('foodName');
  });

  it('maps nested reviews — star becomes rating', () => {
    expect(toRestaurantDetail(apiRestaurantDetail).reviews[0].rating).toBe(5);
  });

  it('preserves totalMenus and totalReviews', () => {
    const result = toRestaurantDetail(apiRestaurantDetail);
    expect(result.totalMenus).toBe(8);
    expect(result.totalReviews).toBe(12);
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npm test
```

Expected: 16 tests pass (5 utils + 11 restaurant mapper).

- [ ] **Step 3: Commit**

```bash
git add features/restaurants/mapper.test.ts
git commit -m "test: restaurant mapper unit tests"
```

---

### Task 6: Write cart mapper tests

**Files:**
- Create: `features/cart/mapper.test.ts`

- [ ] **Step 1: Write the tests**

```ts
// features/cart/mapper.test.ts
import { describe, it, expect } from 'vitest';
import { toCart } from './mapper';
import { apiCartResponse } from '@/test/fixtures/cart.fixture';
import type { ApiCartResponse } from './types';

describe('toCart', () => {
  it('maps foodName to name on nested menu items', () => {
    const result = toCart(apiCartResponse);
    expect(result.groups[0].items[0].menu.name).toBe('Soto Ayam');
    expect(result.groups[0].items[0].menu).not.toHaveProperty('foodName');
  });

  it('preserves quantity and itemTotal', () => {
    const result = toCart(apiCartResponse);
    expect(result.groups[0].items[0].quantity).toBe(2);
    expect(result.groups[0].items[0].itemTotal).toBe(50000);
  });

  it('preserves subtotal per group', () => {
    expect(toCart(apiCartResponse).groups[0].subtotal).toBe(50000);
  });

  it('passes summary through unchanged', () => {
    expect(toCart(apiCartResponse).summary).toEqual({
      totalItems: 2,
      totalPrice: 50000,
      restaurantCount: 1,
    });
  });

  it('returns empty groups array for empty cart', () => {
    const empty: ApiCartResponse = {
      cart: [],
      summary: { totalItems: 0, totalPrice: 0, restaurantCount: 0 },
    };
    expect(toCart(empty).groups).toHaveLength(0);
  });

  it('handles multiple groups', () => {
    const twoGroups: ApiCartResponse = {
      ...apiCartResponse,
      cart: [
        apiCartResponse.cart[0],
        {
          ...apiCartResponse.cart[0],
          restaurant: { id: 2, name: 'Bakso Pak Eko', logo: '' },
        },
      ],
    };
    const result = toCart(twoGroups);
    expect(result.groups).toHaveLength(2);
    expect(result.groups[1].restaurant.name).toBe('Bakso Pak Eko');
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npm test
```

Expected: 22 tests pass (previous 16 + 6 cart mapper).

- [ ] **Step 3: Commit**

```bash
git add features/cart/mapper.test.ts
git commit -m "test: cart mapper unit tests"
```

---

### Task 7: Extract and test login Zod schema

**Files:**
- Create: `app/(auth)/login/login.schema.ts`
- Create: `app/(auth)/login/login.schema.test.ts`
- Modify: `app/(auth)/login/page.tsx`

- [ ] **Step 1: Create login.schema.ts**

```ts
// app/(auth)/login/login.schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export type LoginForm = z.infer<typeof loginSchema>;
```

- [ ] **Step 2: Update app/(auth)/login/page.tsx**

Remove the inline `import { z } from 'zod'`, the inline `const schema = z.object({...})` block, and the `type LoginForm` line. Replace with:

```ts
import { loginSchema, type LoginForm } from './login.schema';
```

Then change the `useForm` call from `resolver: zodResolver(schema)` to:

```ts
resolver: zodResolver(loginSchema),
```

- [ ] **Step 3: Verify the page still type-checks**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 4: Write login.schema.test.ts**

```ts
// app/(auth)/login/login.schema.test.ts
import { describe, it, expect } from 'vitest';
import { loginSchema } from './login.schema';

describe('loginSchema', () => {
  it('passes with valid email and password', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: 'secret' });
    expect(result.success).toBe(true);
  });

  it('fails with empty email — reports "Email is required"', () => {
    const result = loginSchema.safeParse({ email: '', password: 'secret' });
    expect(result.success).toBe(false);
    expect(result.error!.flatten().fieldErrors.email?.[0]).toBe('Email is required');
  });

  it('fails with invalid email format — reports "Invalid email"', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'secret' });
    expect(result.success).toBe(false);
    expect(result.error!.flatten().fieldErrors.email?.[0]).toBe('Invalid email');
  });

  it('fails with empty password — reports "Password is required"', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: '' });
    expect(result.success).toBe(false);
    expect(result.error!.flatten().fieldErrors.password?.[0]).toBe('Password is required');
  });

  it('passes when rememberMe is omitted', () => {
    expect(loginSchema.safeParse({ email: 'user@example.com', password: 'secret' }).success).toBe(true);
  });

  it('passes when rememberMe is true', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: 'secret', rememberMe: true });
    expect(result.success).toBe(true);
  });
});
```

- [ ] **Step 5: Run tests**

```bash
npm test
```

Expected: 28 tests pass (previous 22 + 6 login schema).

- [ ] **Step 6: Commit**

```bash
git add "app/(auth)/login/"
git commit -m "test: extract login schema; add schema tests"
```

---

### Task 8: Extract and test register Zod schema

**Files:**
- Create: `app/(auth)/register/register.schema.ts`
- Create: `app/(auth)/register/register.schema.test.ts`
- Modify: `app/(auth)/register/page.tsx`

- [ ] **Step 1: Create register.schema.ts**

```ts
// app/(auth)/register/register.schema.ts
import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    phone: z.string().min(1, 'Phone number is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterForm = z.infer<typeof registerSchema>;
```

- [ ] **Step 2: Update app/(auth)/register/page.tsx**

Remove the inline `import { z } from 'zod'`, the `const schema = z.object({...}).refine(...)` block, and `type RegisterForm`. Replace with:

```ts
import { registerSchema, type RegisterForm } from './register.schema';
```

Change the `useForm` call from `resolver: zodResolver(schema)` to:

```ts
resolver: zodResolver(registerSchema),
```

- [ ] **Step 3: Verify the page still type-checks**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 4: Write register.schema.test.ts**

```ts
// app/(auth)/register/register.schema.test.ts
import { describe, it, expect } from 'vitest';
import { registerSchema } from './register.schema';

const valid = {
  name: 'Alice',
  email: 'alice@example.com',
  phone: '081234567890',
  password: 'password123',
  confirmPassword: 'password123',
};

describe('registerSchema', () => {
  it('passes with all valid input', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it('fails when name is shorter than 2 characters', () => {
    const result = registerSchema.safeParse({ ...valid, name: 'A' });
    expect(result.success).toBe(false);
    expect(result.error!.flatten().fieldErrors.name?.[0]).toBe('Name must be at least 2 characters');
  });

  it('fails with invalid email format', () => {
    const result = registerSchema.safeParse({ ...valid, email: 'bad-email' });
    expect(result.success).toBe(false);
    expect(result.error!.flatten().fieldErrors.email?.[0]).toBe('Invalid email');
  });

  it('fails with empty phone', () => {
    const result = registerSchema.safeParse({ ...valid, phone: '' });
    expect(result.success).toBe(false);
    expect(result.error!.flatten().fieldErrors.phone?.[0]).toBe('Phone number is required');
  });

  it('fails when password is shorter than 6 characters', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'abc', confirmPassword: 'abc' });
    expect(result.success).toBe(false);
    expect(result.error!.flatten().fieldErrors.password?.[0]).toBe('Password must be at least 6 characters');
  });

  it('fails when passwords do not match', () => {
    const result = registerSchema.safeParse({ ...valid, confirmPassword: 'different' });
    expect(result.success).toBe(false);
    expect(result.error!.flatten().fieldErrors.confirmPassword?.[0]).toBe('Passwords do not match');
  });

  it('passes cross-field check when passwords match', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });
});
```

- [ ] **Step 5: Run tests**

```bash
npm test
```

Expected: 35 tests pass (previous 28 + 7 register schema).

- [ ] **Step 6: Commit**

```bash
git add "app/(auth)/register/"
git commit -m "test: extract register schema; add schema tests"
```

---

### Task 9: Extract and test profile Zod schema

**Files:**
- Create: `app/profile/profile.schema.ts`
- Create: `app/profile/profile.schema.test.ts`
- Modify: `app/profile/page.tsx`

- [ ] **Step 1: Create profile.schema.ts**

```ts
// app/profile/profile.schema.ts
import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
});

export type ProfileForm = z.infer<typeof profileSchema>;
```

- [ ] **Step 2: Update app/profile/page.tsx**

Remove the inline `const schema = z.object({...})` and `type ProfileForm` declaration. Add import:

```ts
import { profileSchema, type ProfileForm } from './profile.schema';
```

In `UpdateProfileModal`, change the `useForm` call from `resolver: zodResolver(schema)` to:

```ts
resolver: zodResolver(profileSchema),
```

- [ ] **Step 3: Verify type-check**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 4: Write profile.schema.test.ts**

```ts
// app/profile/profile.schema.test.ts
import { describe, it, expect } from 'vitest';
import { profileSchema } from './profile.schema';

describe('profileSchema', () => {
  it('passes with valid name and email', () => {
    expect(profileSchema.safeParse({ name: 'Alice', email: 'alice@example.com' }).success).toBe(true);
  });

  it('fails when name is shorter than 2 characters', () => {
    const result = profileSchema.safeParse({ name: 'A', email: 'alice@example.com' });
    expect(result.success).toBe(false);
    expect(result.error!.flatten().fieldErrors.name?.[0]).toBe('Name must be at least 2 characters');
  });

  it('fails with invalid email format', () => {
    const result = profileSchema.safeParse({ name: 'Alice', email: 'not-an-email' });
    expect(result.success).toBe(false);
    expect(result.error!.flatten().fieldErrors.email?.[0]).toBe('Invalid email');
  });

  it('passes when phone is omitted', () => {
    expect(profileSchema.safeParse({ name: 'Alice', email: 'alice@example.com' }).success).toBe(true);
  });

  it('passes with optional phone provided', () => {
    const result = profileSchema.safeParse({ name: 'Alice', email: 'alice@example.com', phone: '0812' });
    expect(result.success).toBe(true);
  });
});
```

- [ ] **Step 5: Run tests**

```bash
npm test
```

Expected: 40 tests pass (previous 35 + 5 profile schema).

- [ ] **Step 6: Commit**

```bash
git add app/profile/
git commit -m "test: extract profile schema; add schema tests"
```

---

### Task 10: Extract and test checkout Zod schema

**Files:**
- Create: `app/checkout/checkout.schema.ts`
- Create: `app/checkout/checkout.schema.test.ts`
- Modify: `app/checkout/page.tsx`

- [ ] **Step 1: Create checkout.schema.ts**

```ts
// app/checkout/checkout.schema.ts
import { z } from 'zod';

export const checkoutSchema = z.object({
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
  phone: z.string().min(5, 'Phone number is required'),
  paymentMethod: z.string().min(1, 'Select a payment method'),
  notes: z.string().optional(),
});

export type CheckoutForm = z.infer<typeof checkoutSchema>;
```

- [ ] **Step 2: Update app/checkout/page.tsx**

Remove the inline `const schema = z.object({...})` and `type CheckoutForm`. Add import:

```ts
import { checkoutSchema, type CheckoutForm } from './checkout.schema';
```

Change the `useForm` call from `resolver: zodResolver(schema)` to:

```ts
resolver: zodResolver(checkoutSchema),
```

- [ ] **Step 3: Verify type-check**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 4: Write checkout.schema.test.ts**

```ts
// app/checkout/checkout.schema.test.ts
import { describe, it, expect } from 'vitest';
import { checkoutSchema } from './checkout.schema';

const valid = {
  deliveryAddress: 'Jl. Sudirman No. 1',
  phone: '081234567890',
  paymentMethod: 'BNI',
};

describe('checkoutSchema', () => {
  it('passes with valid input', () => {
    expect(checkoutSchema.safeParse(valid).success).toBe(true);
  });

  it('fails when deliveryAddress is shorter than 5 characters', () => {
    const result = checkoutSchema.safeParse({ ...valid, deliveryAddress: 'Jl.' });
    expect(result.success).toBe(false);
    expect(result.error!.flatten().fieldErrors.deliveryAddress?.[0]).toBe('Delivery address is required');
  });

  it('fails when phone is shorter than 5 characters', () => {
    const result = checkoutSchema.safeParse({ ...valid, phone: '123' });
    expect(result.success).toBe(false);
    expect(result.error!.flatten().fieldErrors.phone?.[0]).toBe('Phone number is required');
  });

  it('fails when paymentMethod is empty', () => {
    const result = checkoutSchema.safeParse({ ...valid, paymentMethod: '' });
    expect(result.success).toBe(false);
    expect(result.error!.flatten().fieldErrors.paymentMethod?.[0]).toBe('Select a payment method');
  });

  it('passes when notes is omitted', () => {
    expect(checkoutSchema.safeParse(valid).success).toBe(true);
  });

  it('passes with optional notes provided', () => {
    const result = checkoutSchema.safeParse({ ...valid, notes: 'Please ring doorbell' });
    expect(result.success).toBe(true);
  });
});
```

- [ ] **Step 5: Run tests**

```bash
npm test
```

Expected: 46 tests pass (previous 40 + 6 checkout schema).

- [ ] **Step 6: Commit**

```bash
git add app/checkout/
git commit -m "test: extract checkout schema; add schema tests"
```

---

### Task 11: Write auth store tests

**Files:**
- Create: `store/useAuthStore.test.ts`

The `User` type (from `features/auth/types.ts`) is:
```ts
{ id: number; name: string; email: string; phone: string; avatar: string; latitude: number; longitude: number; createdAt: string; }
```

The store uses Zustand `persist` middleware with key `'foody-auth'`. Tests reset state via `useAuthStore.setState` and clear localStorage in `beforeEach`.

- [ ] **Step 1: Write the tests**

```ts
// store/useAuthStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useAuthStore } from './useAuthStore';
import type { User } from '@/features/auth/types';

const mockUser: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  phone: '081234567890',
  avatar: 'https://example.com/avatar.jpg',
  latitude: -6.2,
  longitude: 106.8,
  createdAt: '2024-01-01T00:00:00Z',
};

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    act(() => {
      useAuthStore.setState({ user: null, token: null });
    });
  });

  it('initializes with null user and null token', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('setAuth stores the user and token', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.setAuth(mockUser, 'tok_abc123');
    });
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe('tok_abc123');
  });

  it('clearAuth resets both user and token to null', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => { result.current.setAuth(mockUser, 'tok_abc123'); });
    act(() => { result.current.clearAuth(); });
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('token is null before setAuth is called', () => {
    const { result } = renderHook(() => useAuthStore((s) => s.token));
    expect(result.current).toBeNull();
  });

  it('token reflects latest setAuth value', () => {
    const { result } = renderHook(() => useAuthStore((s) => s.token));
    act(() => {
      useAuthStore.getState().setAuth(mockUser, 'tok_xyz');
    });
    expect(result.current).toBe('tok_xyz');
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npm test
```

Expected: 51 tests pass (previous 46 + 5 store tests).

- [ ] **Step 3: Commit**

```bash
git add store/useAuthStore.test.ts
git commit -m "test: auth store (setAuth, clearAuth, token state)"
```

---

### Task 12: Write login page component tests

**Files:**
- Create: `app/(auth)/login/page.test.tsx`

The mock uses a module-level `mockError` variable so the API error test can override it per-test without needing dynamic imports.

- [ ] **Step 1: Write the test file**

```tsx
// app/(auth)/login/page.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/test/render';
import LoginPage from './page';

const mockMutate = vi.fn();
let mockError: unknown = null;

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useLogin: () => ({ mutate: mockMutate, isPending: false, error: mockError }),
  useAuth: () => ({ user: null, token: null, isAuthenticated: false, logout: vi.fn() }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    mockMutate.mockClear();
    mockError = null;
  });

  it('renders email input, password input, and submit button', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows inline validation errors on empty submit and does not call mutate', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    await user.click(screen.getByRole('button', { name: /login/i }));
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('calls mutate with email and password on valid submit', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    await user.type(screen.getByPlaceholderText('Email'), 'user@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
      });
    });
  });

  it('shows API error message from response when error is set', () => {
    mockError = { response: { data: { message: 'Invalid credentials' } } };
    render(<LoginPage />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials');
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npm test
```

Expected: 55 tests pass (previous 51 + 4 login page).

- [ ] **Step 3: Commit**

```bash
git add "app/(auth)/login/page.test.tsx"
git commit -m "test: login page component tests"
```

---

### Task 13: Write register page component tests

**Files:**
- Create: `app/(auth)/register/page.test.tsx`

- [ ] **Step 1: Write the test file**

```tsx
// app/(auth)/register/page.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/test/render';
import RegisterPage from './page';

const mockMutate = vi.fn();

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useRegister: () => ({ mutate: mockMutate, isPending: false, error: null }),
  useLogin: () => ({ mutate: vi.fn(), isPending: false, error: null }),
  useAuth: () => ({ user: null, token: null, isAuthenticated: false, logout: vi.fn() }),
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    mockMutate.mockClear();
  });

  it('renders all form fields and submit button', () => {
    render(<RegisterPage />);
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Number Phone')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('shows "Passwords do not match" when passwords differ — does not call mutate', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);
    await user.type(screen.getByPlaceholderText('Name'), 'Alice');
    await user.type(screen.getByPlaceholderText('Email'), 'alice@example.com');
    await user.type(screen.getByPlaceholderText('Number Phone'), '081234567890');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'different');
    await user.click(screen.getByRole('button', { name: /register/i }));
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('calls mutate with name, email, phone, password — confirmPassword excluded', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);
    await user.type(screen.getByPlaceholderText('Name'), 'Alice');
    await user.type(screen.getByPlaceholderText('Email'), 'alice@example.com');
    await user.type(screen.getByPlaceholderText('Number Phone'), '081234567890');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'password123');
    await user.click(screen.getByRole('button', { name: /register/i }));
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        name: 'Alice',
        email: 'alice@example.com',
        phone: '081234567890',
        password: 'password123',
      });
    });
    expect(mockMutate).not.toHaveBeenCalledWith(
      expect.objectContaining({ confirmPassword: expect.anything() })
    );
  });

  it('shows inline errors on empty submit — does not call mutate', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);
    await user.click(screen.getByRole('button', { name: /register/i }));
    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run all tests**

```bash
npm test
```

Expected: 59 tests pass across all files with zero failures.

- [ ] **Step 3: Update PROGRESS.md**

In `PROGRESS.md`, mark Phase 8 as complete for all pages (Auth, Home, Restaurant Detail, Cart, Checkout, Payment Success, My Orders, Profile). Add a note that tests cover: mappers, Zod schemas, auth store, login and register page components.

- [ ] **Step 4: Final commit and push**

```bash
git add "app/(auth)/register/page.test.tsx" PROGRESS.md
git commit -m "test: register page component tests; mark Phase 8 complete"
git push
```
