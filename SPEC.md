# Progress

## Setup
- [x] Repo cloned
- [x] API contract saved (`./api/swagger.json`)
- [x] Design assets exported (`./design/*.png`)
- [x] SPEC.md written
- [x] CLAUDE.md written
- [x] PROGRESS.md written
- [x] API base URL verified (real call to `/api/resto` returned data)
- [ ] Dependencies installed (pnpm)
- [ ] Tooling configured (ESLint, Prettier, Husky, lint-staged)
- [ ] CI configured (GitHub Actions)
- [ ] Deployment configured (Vercel)

## Phase 0 — Discovery (BLOCKER for all code work)
- [ ] 0.1 — SPEC.md read and internalized
- [ ] 0.2 — Every Figma design inspected
- [ ] 0.3 — Swagger fully audited (with real-call verification)
- [ ] 0.4 — Architecture proposal output
- [ ] 0.5 — User approval received ⛔

## Pages (locked until Phase 0 approved)

### Restaurants listing — `/restaurants`
- [ ] Phase 1 — Figma re-inspect
- [ ] Phase 2 — Swagger re-audit + real-call verify
- [ ] Phase 3 — Types
- [ ] Phase 4 — Mapper
- [ ] Phase 5 — Static UI
- [ ] Phase 6 — Server state
- [ ] Phase 7 — Client state
- [ ] Phase 8 — Tests
- [ ] Phase 9 — Polish (a11y, Lighthouse)

### Restaurant detail — `/restaurants/[id]`
- [ ] Phase 1–9

### Checkout — `/checkout`
- [ ] Phase 1–9

### Delivery address — profile section
- [ ] Phase 1–9

### Auth flows
- [ ] Login page (Phase 1–9)
- [ ] Register page (Phase 1–9)
- [ ] Auth store + interceptors

### Order history
- [ ] `/orders` page (Phase 1–9)

## Cross-cutting work (post-page)
- [ ] Global error boundary
- [ ] 404 page
- [ ] Layout + navigation
- [ ] Cart drawer (shared component)
- [ ] Toast notifications
- [ ] Sentry integration
- [ ] Web Vitals reporting
- [ ] README with live demo link + screenshots
- [ ] ADRs documented in `docs/decisions/`

## Quality gates (must pass before considering "done")
- [ ] TypeScript strict, zero errors
- [ ] ESLint clean
- [ ] All tests passing in CI
- [ ] Lighthouse mobile: Perf ≥ 90, A11y ≥ 95, BP = 100, SEO ≥ 95
- [ ] WCAG 2.1 AA verified manually
- [ ] Live demo deployed and working
- [ ] README polished