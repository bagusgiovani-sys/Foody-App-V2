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
- [ ] Login page (Phase 1–9)
- [ ] Register page (Phase 1–9)
- [ ] `store/useAuthStore.ts` — Zustand persisted store (replaces Redux authSlice)
- [ ] Update `lib/apiClient.ts` interceptors to read from Zustand store

### Home / Restaurant listing — `/` and `/restaurants`
- [ ] Phase 1 — Figma re-inspect
- [ ] Phase 2 — Swagger re-audit + real-call verify
- [ ] Phase 3 — Types
- [ ] Phase 4 — Mapper (if needed)
- [ ] Phase 5 — Static UI
- [ ] Phase 6 — Server state (TanStack Query hooks)
- [ ] Phase 7 — Client state (filters, tabs)
- [ ] Phase 8 — Tests
- [ ] Phase 9 — Polish (a11y, Lighthouse)

### Restaurant detail — `/restaurants/[id]`
- [ ] Phase 1–9

### My Cart — `/cart`
- [ ] Phase 1–9
- [ ] Remove Redux cart store, wire to API cart

### Checkout — `/checkout`
- [ ] Phase 1–9

### Payment success — `/checkout/success`
- [ ] Phase 1–9

### My Orders — `/orders`
- [ ] Phase 1–9

### Profile — `/profile`
- [ ] Phase 1–9

## Cross-cutting work (do before or alongside pages)
- [ ] `store/useAuthStore.ts` — Zustand persisted auth (replaces Redux)
- [ ] Remove `store/index.ts`, `store/hooks.ts`, `store/provider.tsx` (Redux)
- [ ] Remove `features/auth/authSlice.ts` (Redux)
- [ ] Remove `features/cart/store.ts` (Redux)
- [ ] Update `lib/apiClient.ts` — read token from Zustand, not localStorage
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
