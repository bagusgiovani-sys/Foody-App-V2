# Foody V2 — Claude Code Instructions

## Project context
Portfolio-grade restaurant ordering app. Backend is fixed and deployed; this repo is frontend-only. Goal: production-quality reference implementation showcasing senior-level Next.js + TypeScript work.

Read `./SPEC.md` first — it defines scope, stack, and success criteria. Everything you do must serve those criteria.

## Sources of truth
- **Project spec**: `./SPEC.md` — what we're building and what done means
- **API contract**: `./api/swagger.json` — backend reality. If a field isn't here, double-check with a real API call before assuming it doesn't exist.
- **Design**: `./design/*.png` — UI reality. Pixel-faithful match required.
- **Progress**: `./PROGRESS.md` — where we are right now
- **API base URL**: https://be-restaurant-production.up.railway.app
- **Swagger UI** (human reference only, never for code): https://be-restaurant-production.up.railway.app/api-swagger/

## Git Workflow
- After completing any major change (finishing a phase, completing a page, significant refactor), automatically review the diff, write a descriptive conventional-commit message, commit, and push to the remote branch — without waiting for explicit confirmation from the user.
- Stage only project source files. Never commit `.claude/`, `.playwright-mcp/`, or other tooling artifacts.
- One logical change per commit. Split unrelated changes into separate commits.

## Session Recaps
- When asked for a recap, summarize: (1) completed work, (2) in-progress tasks, (3) exact next step — in a concise bulleted format before continuing with new actions.

---

## Phase 0 — Discovery (do this ONCE before any code)

### Step 0.1 — Read SPEC.md
Internalize scope, stack, and success criteria. Every later decision must trace back to a goal in `SPEC.md`.

### Step 0.2 — Inspect every Figma design
Read every file in `./design/`. For each, output:
- Page name and route
- All UI elements (lists, cards, forms, modals, buttons, inputs)
- All visible states (loading, empty, error, success, hover, focus, disabled)
- Shared components used across pages
- Mobile vs desktop differences (note breakpoints)
- Client-only interactions (filters, modals, selections, scroll behavior)

### Step 0.3 — Audit the entire Swagger
Read `./api/swagger.json` end-to-end. For each page from 0.2:
- Map page → relevant endpoints
- Note auth requirements per endpoint
- Flag field naming inconsistencies (e.g. `food_name` vs `foodName`)
- Flag UI needs with no matching API (gaps)
- Flag API responses with unclear semantics
- Where a response shape feels suspect, verify with a real call to https://be-restaurant-production.up.railway.app/api/* — reality wins over spec

### Step 0.4 — Propose architecture
Output a written proposal covering:
- **Folder structure** — only folders this project actually needs
- **Shared components** — anything appearing on ≥2 pages, extract upfront
- **Mappers needed** — every API → view model conversion required
- **Build order** — which page first, with rationale (usually: lowest-coupling page first)
- **Tooling decisions** — Node version, package manager (pnpm), key library versions
- **Open questions** — anything ambiguous in design or API that blocks progress
- **ADR candidates** — decisions worth documenting in `docs/decisions/`

### Step 0.5 — STOP and confirm with user
Do not write a single source file before user approval.

Output the discovery as a clean summary. Wait for "approved" / "go ahead" / specific corrections. Iterate until approved.

Only after explicit approval, proceed to Phase 1 of the first page.

---

## The 9-phase per-page workflow (after Phase 0 approved)

### Phase 1 — Figma re-inspect
Re-read the specific design for the page. Confirm details from Phase 0 — designs reveal nuance on closer look.

### Phase 2 — Swagger re-audit + real-call verify
Re-read relevant endpoints. Verify field names, types, nullability. Where uncertain, hit the real API to confirm response shape. Ask user if anything still unclear.

### Phase 3 — TypeScript types
Write types matching actual API response shape exactly (real call, not spec). Place in `src/types/api.ts`.

### Phase 4 — View model + mapper (if needed)
If API shape ≠ what UI consumes, create:
- View model in `src/types/models.ts`
- Mapper in `src/lib/mappers/`
- Unit test for mapper in same folder
Skip if shapes already align.

### Phase 5 — Static UI
Build components with hardcoded data matching view model type. No fetching. Implement all states (loading skeleton, error, empty) using static toggles. Pixel-fidelity to Figma established here.

### Phase 6 — Server state (TanStack Query)
Replace hardcoded data with `useQuery` / `useMutation` hooks in `src/hooks/api/`. Each hook fetches and runs mapper. UI consumes view model only.

### Phase 7 — Client state (Zustand / useState)
Add interaction state last: modals, filters, selections, form drafts. If state lives on server, keep in query — never duplicate.

### Phase 8 — Tests
Add unit tests (mappers, utils), component tests (forms), E2E if this page is in a critical user path. See `SPEC.md` testing requirements.

### Phase 9 — Polish
Accessibility audit (keyboard, screen reader, focus, contrast). Lighthouse run. Fix anything below thresholds in `SPEC.md`.

---

## Hard rules

- **Phase 0 must complete and be approved before any code is written**
- One page fully done (all 9 phases) before starting another
- Never invent API field names — verify in `swagger.json` AND with a real call when in doubt
- Never use placeholder data outside Phase 5
- Never hit the API in Phase 5 — that's Phase 6's job
- Never mix server state and client state in the same store
- If Swagger response ≠ what UI needs, write a mapper — never reshape UI to fit ugly API
- No `any` ever. If type is genuinely unknown, ask the user.
- No commented-out code in commits
- No console.logs in committed code (use proper logger if needed)
- Ask the user when uncertain. Never assume. Never improvise.

## Conventions

### Where things live (create folders as needed)
- API response types → `src/types/api.ts`
- View model types → `src/types/models.ts`
- API → view model mappers → `src/lib/mappers/`
- API client (axios + interceptors) → `src/lib/api-client.ts`
- TanStack Query hooks → `src/hooks/api/`
- Zustand stores (client state only) → `src/stores/`
- shadcn primitives → `src/components/ui/`
- Feature components → `src/components/[feature]/`
- Page routes → `src/app/[route]/page.tsx`
- Utilities → `src/lib/utils.ts`
- Constants → `src/lib/constants.ts`
- Tests co-located: `foo.ts` + `foo.test.ts`
- E2E tests → `e2e/`
- Architecture decisions → `docs/decisions/NNN-decision-title.md`

### Naming
- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts` (always `use` prefix)
- API types: `Api*` prefix (e.g. `ApiRestaurant`, `ApiCartItem`)
- View models: domain noun (e.g. `Restaurant`, `CartItem`)
- Mappers: `to*` prefix (e.g. `toRestaurant`, `toCartItem`)
- Stores: `*Store` suffix (e.g. `useAuthStore`)

### TanStack Query
- Query keys: hierarchical arrays — `['restaurants', filters]`, `['restaurant', id]`
- `staleTime: 60_000` default, override per query
- Mutations invalidate related queries on success
- Error handling: rethrow in queryFn, handle at consumer with `error` property
- Use `placeholderData: keepPreviousData` for paginated lists

### Auth
- Token in Zustand persisted store (`useAuthStore`)
- Auto-attach Bearer token via axios request interceptor
- Response interceptor: 401 → clear store + redirect to `/login`
- Protected routes: server-side check in layout/page

### Forms
- React Hook Form + Zod resolver
- Validation schema co-located with form component
- Submit button disabled while pending
- Errors displayed inline below each field with `aria-invalid` and `aria-describedby`

### Accessibility
- Every interactive element keyboard-reachable
- Visible focus rings (don't disable outline without replacement)
- Icon-only buttons need `aria-label`
- Forms use `<label>` properly associated
- Modals trap focus and restore on close
- Loading states announced to screen readers via `aria-live`

### Git
- Conventional Commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`
- One logical change per commit
- PR descriptions reference the SPEC criterion being satisfied
- No direct commits to main; PRs only

---

## When the user gives you a task

1. Read `./PROGRESS.md` — know where the project is
2. **If Phase 0 is not yet approved, do Phase 0 first regardless of what was asked**
3. Otherwise, identify which page and which phase
4. State the phase explicitly: "Working on Restaurant Detail page, Phase 3 (types)"
5. Do only that phase. Do not skip ahead.
6. When phase complete, update `./PROGRESS.md`
7. Stop and confirm with user before starting next phase

## What you do NOT do
- Do not skip Phase 0
- Do not predeclare folders that have no files
- Do not generate placeholder UI to "save tokens"
- Do not skip Phase 2 even if the endpoint "looks obvious"
- Do not write fetch calls in components — go through `src/hooks/api/`
- Do not store server data in Zustand
- Do not use `any`
- Do not ship without tests for the touched code
- Do not skip the accessibility pass

## Communication style
- Brief and direct. No preamble.
- State the phase you're on at the start of each response
- Reference exact file paths
- No filler ("Great question!", "Certainly!")
- If blocked, say what's blocking and what info you need

## Project-specific gotchas (refine after Phase 0)
- API uses `star` not `rating` — map in mapper layer
- Menu schema uses `food_name` but cart/order responses return `foodName` — different shapes per endpoint, mappers must handle each
- `GET /api/resto` real response includes a `filters` object inside `data` that's NOT in the swagger spec — always verify with real API calls, the spec is a guideline not absolute truth
- Auth endpoints return `{ user, token }` inside `data` — extract token before any other request
- Cart endpoint pre-groups items by restaurant
- Some endpoints have inconsistent response wrapping (`data.cart` vs `data.restaurants` vs `data.review`) — mappers must handle this per endpoint
- All restaurant endpoints return `category` even when swagger schema omits it