# Foody V2

A portfolio-grade restaurant ordering app — frontend only, built against a fixed deployed backend.

**Live API:** https://be-restaurant-production.up.railway.app  
**Figma Design:** [Restaurant App](https://www.figma.com/design/1By7DB1gDCNEoW62UqLUrA/Restaurant-App?node-id=37411-2452)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Server state | TanStack Query v5 |
| Client state | Zustand v5 (persisted auth) |
| Forms | React Hook Form + Zod |
| HTTP | Axios with request/response interceptors |
| Toasts | Sonner |

No Redux in the final codebase — fully migrated to TanStack Query + Zustand.

---

## Pages

| Page | Route | Auth |
|---|---|---|
| Home | `/` | No |
| Restaurant listing | `/restaurants` | No |
| Restaurant detail | `/restaurants/[id]` | No |
| My Cart | `/cart` | Yes |
| Checkout | `/checkout` | Yes |
| Payment Success | `/checkout/success` | Yes |
| My Orders | `/orders` | Yes |
| Profile | `/profile` | Yes |
| Login | `/login` | No |
| Register | `/register` | No |

---

## Architecture highlights

- **Mapper pattern** — every API response is transformed in a mapper layer (`star → rating`, `foodName → name`) before reaching the UI. Components only consume view models, never raw API shapes.
- **Feature-based structure** — each domain (`auth`, `restaurants`, `cart`, `checkout`, `orders`, `profile`) owns its types, services, hooks, and components.
- **Zero server state in Zustand** — TanStack Query owns all server state. Zustand is used only for auth (persisted) and the one-shot checkout receipt store (non-persisted).
- **Token flow** — Bearer token read from Zustand in the Axios interceptor. 401 on protected routes clears auth and redirects to `/login`.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

The API base URL defaults to the production backend. To override:

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://be-restaurant-production.up.railway.app
```

---

## Project Structure

```
app/                    # Next.js App Router pages
  (auth)/login          # Login page
  (auth)/register       # Register page
  restaurants/          # Listing + [id] detail
  cart/                 # Cart page
  checkout/             # Checkout + /success
  orders/               # My orders
  profile/              # Profile + edit modal
components/
  layout/               # Navbar, Footer, MainLayout, SidebarNav
features/
  auth/                 # Types, services, hooks, components
  cart/                 # Types, mapper, services, hooks, components
  checkout/             # Types, services, hooks
  orders/               # Types, services, hooks, components
  profile/              # Types, services, hooks, components
  restaurants/          # Types, mapper, services, hooks, components
store/
  useAuthStore.ts       # Zustand persisted auth
  useCheckoutStore.ts   # Zustand ephemeral receipt
  provider.tsx          # QueryClientProvider + Sonner Toaster
lib/
  apiClient.ts          # Axios instance with interceptors
  queryClient.ts        # TanStack QueryClient config
constants/
  api.ts                # All API endpoint paths
```

---

## Scripts

```bash
npm run dev     # Start development server
npm run build   # Production build
npm run lint    # ESLint check
```
