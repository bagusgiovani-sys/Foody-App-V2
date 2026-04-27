# Progress

## Setup
- [x] Repo cloned
- [x] API contract saved (`./app/api/swagger.json`)
- [x] Design assets exported (`./app/design/*.png`)
- [x] SPEC.md written (project spec, not progress tracker)
- [x] CLAUDE.md written
- [x] PROGRESS.md written
- [x] API base URL verified (real call to `/api/resto` returned data)
- [x] Dependencies installed (npm)
- [ ] Tooling configured (ESLint strict, Prettier, Husky, lint-staged)
- [ ] CI configured (GitHub Actions)
- [ ] Deployment configured (Vercel)

## Phase 0 — Discovery ✅ APPROVED
- [x] 0.1 — SPEC.md read and internalized
- [x] 0.2 — Every design file inspected (`app/design/*.png`)
- [x] 0.3 — Swagger fully audited + review endpoint confirmed
- [x] 0.4 — Architecture proposal output
- [x] 0.5 — User approval received ✅

### Approved decisions
- Full Zustand migration — no Redux in final code
- Cart is server state via TanStack Query (`GET /api/cart`)
- Delivery address pre-filled from profile, inline override on checkout page
- Review endpoint confirmed: `POST /api/review` (requires transactionId + restaurantId + star)
- SPEC.md rewritten as proper project spec

## Pages

### Auth flows
- [x] Login page (Phases 1–7, 9 done; Phase 8 skipped for now)
- [x] Register page (Phases 1–7, 9 done; Phase 8 skipped for now)
- [x] `store/useAuthStore.ts` — Zustand persisted store (replaces Redux authSlice)
- [x] Update `lib/apiClient.ts` interceptors to read from Zustand store

### Home / Restaurant listing — `/` and `/restaurants`
- [x] Phase 1 — Figma re-inspect
- [x] Phase 2 — Swagger re-audit + real-call verify
- [x] Phase 3 — Types (`features/restaurants/types.ts`)
- [x] Phase 4 — Mapper (`features/restaurants/mapper.ts` — `star` → `rating`)
- [x] Phase 5 — Static UI (skeleton loaders, all states)
- [x] Phase 6 — Server state (`useRestaurantList` TanStack Query hook)
- [x] Phase 7 — Client state (distance/price/rating filters, mobile drawer)
- [ ] Phase 8 — Tests (skipped for now)
- [ ] Phase 9 — Polish (a11y, Lighthouse)

### Restaurant detail — `/restaurants/[id]`
- [x] Phase 1 — Figma re-inspect
- [x] Phase 2 — Swagger re-audit + real-call verify
- [x] Phase 3 — Types (ApiRestaurantDetail, MenuItemDetail, ReviewDetail, RestaurantDetail)
- [x] Phase 4 — Mapper (foodName→name, star→rating for menus and reviews)
- [x] Phase 5 — Static UI (gallery, info bar, menu grid, review grid, all skeletons)
- [x] Phase 6 — Server state (useRestaurantDetail hook)
- [x] Phase 7 — Client state (menu type tabs, qty controls, add-to-cart, navbar dropdown)
- [ ] Phase 8 — Tests (skipped for now)
- [ ] Phase 9 — Polish (a11y, Lighthouse)

### My Cart — `/cart`
- [x] Phase 1 — Figma re-inspect
- [x] Phase 2 — Swagger re-audit + real-call verify
- [x] Phase 3 — Types (ApiCart*, Cart view model)
- [x] Phase 4 — Mapper (foodName→name, ApiCartResponse→Cart)
- [x] Phase 5 — Static UI (skeleton, empty, error, loaded states)
- [x] Phase 6 — Server state (useCart, useAddToCart, useUpdateCartItem, useRemoveCartItem, useClearCart)
- [x] Phase 7 — Client state (qty controls inline, per-group checkout → /checkout?restaurantId=)
- [ ] Phase 8 — Tests (skipped for now)
- [ ] Phase 9 — Polish (a11y, Lighthouse)
- [x] Remove Redux cart store, wire to API cart

### Checkout — `/checkout`
- [ ] Phase 1–9

### Payment success — `/checkout/success`
- [ ] Phase 1–9

### My Orders — `/orders`
- [ ] Phase 1–9

### Profile — `/profile`
- [ ] Phase 1–9

## Cross-cutting work (do before or alongside pages)
- [x] `store/useAuthStore.ts` — Zustand persisted auth (replaces Redux)
- [x] Remove `store/index.ts`, `store/hooks.ts` (Redux) — provider now pure QueryClientProvider
- [x] Remove `features/auth/authSlice.ts` (Redux)
- [x] Remove `features/cart/store.ts` (Redux)
- [x] Update `lib/apiClient.ts` — read token from Zustand, not localStorage
- [ ] Global error boundary
- [ ] 404 page
- [ ] Toast notifications
- [ ] README with live demo link + screenshots
- [ ] ADRs documented in `docs/decisions/`

## Quality gates (must pass before "done")
- [ ] TypeScript strict, zero errors
- [ ] ESLint clean
- [ ] All tests passing in CI
- [ ] Lighthouse mobile: Perf ≥ 90, A11y ≥ 95, BP = 100, SEO ≥ 95
- [ ] WCAG 2.1 AA verified manually
- [ ] Live demo deployed and working
- [ ] README polished
