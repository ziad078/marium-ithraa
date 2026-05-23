# AI Frontend Context

This file is the AI-readable architecture map for the Ithraa frontend. It was reverse engineered from the repository rather than inferred from a product brief.

## 1. Frontend Overview

The frontend is a multilingual Next.js application for an educational / child-evaluation platform. It supports public marketing pages, authentication and signup, role-based dashboards, organization management, children/classes/grades/teachers management, evaluations/tests, parent evaluation attempts, notifications, and administrative reporting.

Core stack:

```txt
Next.js 16 App Router
React 19
TypeScript
next-intl
next-auth credentials provider
TanStack React Query
TanStack React Table
React Hook Form + Zod in newer forms
Tailwind CSS v4 + shadcn/ui/Radix primitives
Sonner + react-toastify
```

The app is locale-first. Most visible routes live under `src/app/[locale]`; `src/app/[locale]/layout.tsx` validates the locale, sets `<html lang dir>`, installs `NextIntlClientProvider`, React Query, NextAuth session provider, tooltip provider, and a `react-toastify` `ToastContainer`.

Main user journeys:

- Public visitor opens `/{locale}` through `src/app/[locale]/(main)/page.tsx`, sees home sections from `src/components/pages/home/*`, and can move to login or signup.
- User logs in via `src/app/[locale]/auth/login/page.tsx` and `src/components/pages/login/LoginForm.tsx`, which delegates credentials to NextAuth through `useAuth()` and `signInWithPhoneAndRedirect`.
- Authenticated users are redirected by `src/proxy.ts` based on email verification and roles.
- Admin users work under `/dashboards/admin`: users, organizations, children, tests, evaluations, attempts, notification dispatch.
- Organization owners work under `/dashboards/organization`: grades, classes, children, teachers, employees, results.
- Parents work under `/dashboards/parent`: children, available evaluations, attempts, evaluation-taking flow.
- Notifications are available through `/dashboards/notifications` and a bell dropdown.

Rendering strategy:

- Server components are used primarily at route boundaries to fetch initial data with authenticated server calls. Example: `src/app/[locale]/dashboards/organization/children/page.tsx` fetches organization, children, grades, and classes on the server, then renders `ChildrenScreen` as a client component.
- Client components own filtering, dialogs, local UI state, React Query refetches, and form interactivity.
- Server actions are used for many organization CRUD flows: `src/features/children/actions/*`, `src/features/grades/actions/*`, `src/features/classes/actions/*`, `src/features/teachers/actions/*`, `src/features/employees/actions/*`.
- React Query is used for client-driven server state, especially evaluations and notifications.

High-level flow:

```txt
Browser
  -> src/proxy.ts
      -> next-intl locale handling
      -> next-auth JWT token check
      -> email verification + role redirect/gating
  -> src/app/[locale]/layout.tsx
      -> NextIntlClientProvider
      -> QueryClientProvider
      -> SessionProvider
  -> route layout
      -> role shell / sidebar / organization header
  -> page server component
      -> feature API server functions
      -> client screen component
```

## 2. Project Structure

Important folders:

```txt
src/app
  [locale]                Locale-scoped App Router routes
  api/auth                NextAuth and auth helper route handlers

src/components
  ui                      shadcn/Radix primitives and generated UI building blocks
  shared                  reusable app components: forms, data tables, dashboard cards, management screens
  pages                   page-level client screens grouped by product area
  layouts                 public and organization header/footer shells
  evaluation              evaluation runner/builder/result UI
  notifications           notification list/bell components

src/features
  auth                    NextAuth client hooks, RBAC utilities, signup flow
  evaluations             API, hooks, types, columns, payload helpers
  notifications           API, hooks, notification types
  children/classes/grades organization domain CRUD
  employees/teachers      staff CRUD and tables
  users/organizations     admin/user and organization APIs
  admin/parent/enrichers  role-specific shell components

src/lib
  api                     server/client fetch wrappers
  auth                    token expiry and sign-in redirect helpers
  types                   shared enums and large cross-feature interfaces
  helpers                 server helpers such as current organization
  utils.ts                cn() and token refresh

messages
  en.json, ar.json         next-intl messages
```

Feature folders usually follow this pattern:

```txt
features/<domain>/
  api/index.ts
  actions/*.action.ts
  hooks/index.ts
  components/*.tsx
  types/*.ts
  index.ts
```

The structure works because API functions, server actions, and domain UI are close to their feature. Route files remain mostly thin adapters. For example, organization children route files call `getAllChildrenByOrg`, `getGradesByOrg`, `getClassesByOrg`, then hand data to `ChildrenScreen`.

Where it breaks:

- `src/components/pages/*` owns many feature-specific screens, while `src/features/*/components` also owns feature UI. This creates a split ownership model. Example: `AdminEvaluationsScreen` is under `components/pages/dashboards/admin`, but evaluation columns and hooks live under `features/evaluations`.
- There are multiple table components with overlapping names: `src/components/shared/data-table/DataTable.tsx`, `src/components/ui/data-table.tsx`, and `src/components/data-table.tsx`. The last one is a large shadcn demo-like table with DnD, tabs, charts, and hardcoded schema.
- Shared types are duplicated or scattered across `src/lib/types/types.ts`, `src/lib/types/types/interfaces.ts`, `src/lib/types/interfaces.ts`, and feature-level `types`.
- Naming contains typos baked into routes/enums: `unautharized`, `email-verfication`, `chose-role`, `ENRECHERSIGNUP`. Do not “clean these up” casually because route paths depend on them.

Scalability concern: the project is feature-oriented but not consistently feature-owned. Future agents should prefer adding new domain logic inside `src/features/<domain>` and only put route composition in `src/app` and screen composition in one place.

## 3. Routing & Navigation

Routing is Next App Router under `src/app/[locale]`.

Important route groups and pages:

```txt
/{locale}
  (main)/page.tsx                         Public home
  auth/login/page.tsx                     Login
  auth/Beneficiarysignup/page.tsx         Beneficiary signup
  auth/enrichersignup/page.tsx            Enricher signup
  chose-role/page.tsx                     Multi-role dashboard chooser
  email-verfication/page.tsx              Authenticated email verification state
  verify-email/page.tsx                   Token verification endpoint UI
  dashboards/admin/*                      Admin dashboard
  dashboards/organization/*               Organization owner dashboard
  dashboards/parent/*                     Parent dashboard
  dashboards/employee/*                   Employee dashboard
  dashboards/enricher/*                   Enricher dashboard
  dashboards/notifications/page.tsx       Shared notification center
```

`src/proxy.ts` is the central middleware-like gate. It:

- Runs `next-intl` middleware using `src/i18n/routing.ts` locales `en` and `ar`, default `ar`.
- Extracts the locale from the pathname and strips it for route checks.
- Reads the NextAuth JWT with `getToken`.
- Redirects unauthenticated users away from protected routes.
- Redirects authenticated users away from auth routes.
- Forces unverified authenticated users on protected routes to `/{locale}/email-verfication`.
- Routes users after auth by role using `roleHome()`.
- Enforces dashboard section access with `ACCESS_MAP`.

Role routing map:

```txt
ADMIN              -> /{locale}/dashboards/admin
ORGANIZATIONOWNER  -> /{locale}/dashboards/organization
EMPLOYEE           -> /{locale}/dashboards/employee
ENRICHER           -> /{locale}/dashboards/enricher
PARENT             -> /{locale}/dashboards/parent
multiple roles     -> /{locale}/chose-role
```

Layout hierarchy:

```txt
src/app/[locale]/layout.tsx
  (main)/layout.tsx                 Public Header + Footer
  dashboards/layout.tsx             Thin pass-through wrapper
    admin/layout.tsx                RequireRoles ADMIN + shadcn SidebarProvider
    parent/layout.tsx               RequireRoles PARENT + sidebar + DashboardTopBar
    organization/layout.tsx         session + getCurrentOrganization + custom fixed header/footer
    employee/layout.tsx             sidebar shell, currently no RequireRoles wrapper
    enricher/layout.tsx             sidebar shell, currently no RequireRoles wrapper
```

Protected route mechanisms are layered:

- `src/proxy.ts` is the first gate and performs global redirects.
- `src/features/auth/components/RequireRoles.tsx` is a server component used by some layouts to enforce roles.
- `src/features/auth/components/ProtectedRoute.tsx` is a client guard, but route layouts mostly use server guards instead.

Navigation primitives:

- Locale-aware navigation wrappers come from `src/i18n/navigation.ts`.
- Many components correctly use `Link` from `@/i18n/navigation`.
- Some code imports `next/link` or `next/navigation` directly; this can bypass locale-aware behavior if not careful.
- Sidebars use `NavMain`, `NavDocuments`, `NavSecondary`, and `NavUser`.
- Organization owner navigation uses `OrganizationHeader`, not the sidebar.

Breadcrumbs are mostly ad hoc through `ManagementPageHeader`, not a global route-derived breadcrumb system.

## 4. UI Architecture

The design system is shadcn/Radix-based with Tailwind v4 tokens.

UI primitive layer:

- `src/components/ui/button.tsx`, `card.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `sidebar.tsx`, `form.tsx`, `input.tsx`, `select.tsx`, `tabs.tsx`, `table.tsx`, etc.
- `components.json` uses shadcn `new-york`, RSC enabled, `lucide` icon library, CSS variables, and aliases `@/components`, `@/lib`, `@/hooks`.
- `src/lib/utils.ts` provides `cn()` using `clsx` + `tailwind-merge`.

Shared app components:

- `src/components/shared/management/ManagementPageHeader.tsx`: title/subtitle/breadcrumb/action header for organization management pages.
- `src/components/shared/management/ListFilters.tsx`: controlled search/grade/class filters.
- `src/components/shared/management/EntityCard.tsx`: repeated card for entity fields, with render-prop edit/delete dialogs.
- `src/components/shared/data-table/DataTable.tsx`: minimal generic TanStack table.
- `src/components/shared/dashboard/*`: reusable dashboard top bar, stats grid, cards, quick actions, activity feed.
- `src/components/notifications/*`: notification item, bell, list utilities.
- `src/components/evaluation/*`: evaluation runner, question card, answer group, result views.

Major shells:

- `AdminSidebar` in `src/features/admin/components/admin-sidebar.tsx` builds admin nav using translations and session user.
- `ParentSidebar` in `src/features/parent/components/parent-sidebar.tsx` builds parent nav.
- `EmployeeSidebar` and `EnricherSidebar` follow the same sidebar pattern.
- `OrganizationHeader` in `src/components/layouts/organizationHeader/OrganizationHeader.tsx` is a fixed rounded header with manual nav links, search, auth actions, notification bell, language switcher, and mobile menu.

Composition pattern:

```txt
page.tsx server component
  fetch data via feature api/server helper
  render <FeatureScreen data locale />

FeatureScreen client component
  own local filters/dialog state
  render shared components and feature columns/cards
  call server actions or React Query hooks for mutations
```

Anti-patterns and coupling:

- Some shared components contain domain assumptions. Example: `src/components/ui/data-table.tsx` imports `AddEmployeeDialog` and is therefore not a true UI primitive.
- `EntityCard` is reusable but heavily geared toward edit/delete card CRUD flows.
- Many components hardcode color values such as `bg-[#f3eefb]`, fuchsia/indigo gradients, and rounded `2xl/3xl`, bypassing semantic tokens.
- Some Arabic strings in source appear as mojibake. Prefer `messages/ar.json` / `messages/en.json` (especially `Actions.*` and `Dashboard.*`) over inline copy.

## 5. State Management

There is no Redux and no real Zustand store. `src/features/auth/store/auth-store.ts` is a compatibility/export module, not a Zustand store. It explicitly says session state lives in NextAuth.

State categories:

- Auth/session state: NextAuth JWT/session via `useSession`, `getServerSession`, `getToken`.
- Server state: React Query for client-side reads/mutations, and server component fetches for SSR-style initial data.
- Form state: mixed. Some forms use `react-hook-form` + `zod`; many legacy forms use raw `FormData`, refs, and server actions.
- Local UI state: `useState` and `useMemo` inside screen components for search/filter/dialog/loading state.
- Derived state: local `useMemo` filters for lists and card grids.

React Query setup:

- `src/components/providers/QueryClientProvider.tsx` creates a module-level `new QueryClient()` and wraps the app.
- There are no global query defaults configured.
- Evaluation query keys are centralized in `src/features/evaluations/hooks/index.ts`.
- Notification query keys are centralized in `src/features/notifications/hooks/index.ts`.
- Other domains use simple query keys in hooks: examples include `["admin", "children"]`, `["admin", "users-in-roles"]`, `["organizations"]`.

Important state ownership examples:

- `useEvaluationSession()` owns active attempt answers, dirty state, timers, autosave, beforeunload protection, and submit/save mutations.
- `NotificationsScreen` owns pagination and filters, while server data comes from React Query.
- Organization management screens receive initial arrays from server components and own client-side search/filter only.

Synchronization risks:

- Server component data and React Query data coexist. A list fetched by a server component will not automatically sync with a React Query mutation unless the flow uses server actions with `revalidatePath` or performs navigation/refetch.
- Some query invalidation is broad or inconsistent. Example: evaluations invalidate `["attempts"]` and `["child-attempts"]` while canonical key builders also include parameterized keys.
- Local filtered arrays are derived from props and may go stale after server actions until route revalidation/navigation completes.

## 6. API Layer

Central API wrapper is `src/lib/api/api.ts`:

```ts
export const api = {
  client: clientApiFetch,
  server: serverApiFetch,
}
```

Client API:

- File: `src/lib/api/client-api-client.ts`
- Calls relative `/api${endpoint}`.
- Next rewrites proxy `/api/:path((?!auth/).*)` to `${BACKEND_URL}/api/:path*`.
- Retrieves token with `getSession()` from NextAuth.
- Adds `Authorization: Bearer <accessToken>`.
- On `401`, clears token cache, attempts to resolve a refreshed token once, then signs out to `/auth/login`.
- Parses JSON for every successful response. Empty `204` responses can be risky because invalid JSON throws `ApiError("Invalid server response")`.

Server API:

- File: `src/lib/api/server-api-clent.ts` (note typo in filename)
- Calls `${process.env.BACKEND_URL}/api${endpoint}` directly.
- Uses `getServerSession(nextAuthOptions)` for token.
- Adds `Authorization`.
- Forces `cache: "no-store"`.
- Parses JSON and throws `ApiError`.

Auth routes:

- NextAuth route: `src/app/api/auth/[...nextauth]/route.ts`
- Extra route handlers: `src/app/api/auth/refresh/route.ts`, `verify-email/route.ts`, `enrichers-signup/route.ts`.

Feature API pattern:

- Domains export server/client variants when needed. Example `src/features/evaluations/api/index.ts` has `getEvaluations` and `getEvaluationsClient`, `getAttemptById` and `getAttemptByIdClient`, etc.
- Endpoints are partly centralized in `src/lib/types/enums.ts` as `Endpoint`.
- Query strings are manually built with `URLSearchParams` in evaluations and notifications APIs.

API abstraction quality:

- Good: one wrapper for auth headers and normalized `ApiError`.
- Good: server/client distinction is explicit.
- Risk: direct `fetch` exists outside wrappers. Example `SignupWizard` posts to `process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"` directly.
- Risk: response shapes are assumed and not runtime-validated except for some form payload schemas.
- Risk: `Content-Type: application/json` is always added, which is unsuitable if true file uploads are introduced.

## 7. Forms & Validation

Unified forms architecture (`src/features/forms/`):

- **Schemas** (`schemas/*.schema.ts`): Zod validation per entity (login, employee, teacher, grade, class, child, test).
- **Config registry** (`config/*.config.ts` + `config/index.ts`): field metadata with `labelKey` / `placeholderKey` resolved via `useFormConfig(FormTypes.*)` and `messages/*/Forms`.
- **RHF renderer** (`components/RhfFormFields.tsx`): maps registry fields to shadcn inputs; phone uses `react-phone-number-input`; password is RHF-controlled.
- **Server action wrapper** (`components/ServerActionForm.tsx` + `hooks/useServerActionForm.ts`): `zodResolver` + `useActionState`; submits `FormData` to server actions.
- **Parsing** (`parse-form-data.ts`): `parseFormData(formData, schema)` with `safeParse`.
- **Action results** (`action-results.ts`): standardized `{ success, message, fieldErrors?, status?, formData? }` where `message` is an i18n key under `Actions.*`.
- **Toasts** (`src/lib/toast/app-toast.ts`, `src/hooks/useActionFeedback.ts`): Sonner only; `showSuccessToast(t, messageKey)`.

Other RHF + Zod forms (unchanged pattern):

- Beneficiary signup wizard, admin evaluation creation, evaluation attempts, test creation wizard (`TestCreationForm`).

Server action forms:

- CRUD actions use `parseFormData` + `actionSuccess` / `actionErrorState`.
- Delete actions return `DeleteActionResult` (`{ success, message? }`).
- Client screens call `useActionFeedback().notifyAction` / `notifyDelete` with `useTranslations("Actions")`.

UX:

- Loading buttons use `Loader2` or `isPending` from `useServerActionForm`.
- Notifications use Sonner via `app-toast` helpers (no `react-toastify`).

## 8. Async & Data Fetching

Data fetching modes:

- Server component fetching for route initial data:
  - `getCurrentOrganization()`
  - feature `api.server` calls
  - parallelized with `Promise.all` in some pages
- Client React Query fetching:
  - evaluations
  - attempts
  - notifications
  - some admin/user/org lookups
- Server actions for mutations:
  - organization CRUD
  - teacher/employee/child/class/grade operations

Loading states:

- Route-level server component fetches usually do not define `loading.tsx`.
- Client screens use `Skeleton` or text fallbacks. Examples: `EvaluationRunner`, `NotificationBell`, `NotificationsScreen`.
- Auth guards use `AuthLoadingScreen`.

Mutation handling:

- React Query mutations invalidate related keys.
- Server actions revalidate route paths but do not always redirect.
- Evaluation attempt saving/submitting uses `mutateAsync` and local toast feedback.

Evaluation async flow:

```txt
Parent starts attempt
  -> useStartEvaluation(evaluationId)
  -> POST /evaluations/:id/start
  -> route to /dashboards/parent/attempts/:attemptId

EvaluationRunner
  -> useEvaluationSession(attemptId)
      -> useAttempt(attemptId)
      -> optional useEvaluationForm(evaluationId) fallback
      -> local answers map
      -> autosave every 1200ms after dirty changes
      -> beforeunload warning while dirty
      -> auto-submit when expiresAt passes
```

Scalability:

- Evaluation and notification async patterns are the most mature.
- CRUD screens should eventually converge on either server actions plus `revalidatePath` or React Query mutations, not a mixture per feature.
- There is no Suspense strategy beyond normal App Router server rendering.

## 9. Authentication & Authorization

Authentication is NextAuth credentials-based.

Files:

- `src/server/auth.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/features/auth/hooks/useAuth.ts`
- `src/features/auth/utils/rbac.ts`
- `src/features/auth/utils/redirects.ts`
- `src/lib/auth/token-expiry.ts`
- `src/lib/utils.ts` `refreshAccessToken()`

Login lifecycle:

```txt
LoginForm
  -> signInWithPhoneAndRedirect
  -> useAuth().login()
  -> next-auth credentials provider
  -> POST BACKEND_URL/api/auth/login
  -> JWT stores id, roles, accessToken, refreshToken, expiry, verification flags
  -> redirect helper chooses dashboard/email-verification/chose-role
```

Token lifecycle:

- JWT strategy, `maxAge` 30 days.
- `jwt` callback stores tokens on first login.
- If access token is expired, `refreshAccessToken()` posts to `${BACKEND_URL}/api/auth/refresh` using refresh token as bearer.
- On refresh failure, token gets `RefreshAccessTokenError`; client API and `useAuth` treat this as session expired.

Authorization:

- Global gate in `src/proxy.ts` checks protected route sections and roles.
- Server layout gate `RequireRoles` checks `getServerSession`.
- Client utility `useRBAC` / `useAuth().checkRole` checks UI access.

Risks:

- `employee/layout.tsx` and `enricher/layout.tsx` import auth-related symbols but do not wrap with `RequireRoles`; they currently rely mostly on `src/proxy.ts`.
- `RequireRoles` default redirects are not locale-prefixed (`/${Routes.AUTH}/login`, `/${Routes.UNAUTHARIZED}`), though some callers pass custom redirect values.
- Frontend role checks must be treated as UX gates only. Backend must enforce permissions.
- `.env` currently contains a checked-in `NEXTAUTH_SECRET`; secrets should not live in committed frontend code.

## 10. Styling System

Tailwind v4 is configured through CSS, not a `tailwind.config.*` file.

Main styling file:

- `src/app/[locale]/globals.css`

Key pieces:

- Imports: `tailwindcss`, `tw-animate-css`, `shadcn/tailwind.css`.
- Uses CSS variables and `@theme inline` to expose shadcn tokens.
- Defines `:root` and `.dark` token values with `oklch`.
- Sets `--font-sans` to `--font-cairo`, provided by `next/font/google` in root layout.
- Global `body` uses fixed radial-gradient backgrounds.
- `.app-container` utility sets `max-w-7xl mx-auto px-6 lg:px-8`.
- `.between-center` utility sets flex row between/center.

Theme:

- Dark tokens exist, but no visible `ThemeProvider` or theme toggle is wired in the root provider. `next-themes` is installed but not obviously used.
- RTL is handled at document level via `<html dir>` and some components also set explicit `dir`.

Design consistency:

- shadcn primitives are consistent.
- Dashboard shells often use `bg-[#f3eefb]`.
- Many newer management screens use rounded cards, gradients, and fuchsia/indigo accents.
- Public/home components use richer marketing styling and image assets.

Maintainability concerns:

- Hardcoded colors and gradients compete with semantic tokens.
- Arabic text should be moved out of component source and into `messages/ar.json`.
- Some classes use very rounded surfaces (`rounded-3xl`, `rounded-[64px]`) even for operational dashboard UI.

## 11. Performance Review

Positive:

- Route pages often fetch server data in parallel with `Promise.all`.
- Server components reduce initial client fetching for many management pages.
- Evaluation lists and notifications use React Query cache.
- Next `Image` is used for logos/hero/static assets.
- React Compiler is enabled in `next.config.ts`.

Risks:

- Very many components are client components. This increases hydration and bundle size.
- Large UI/demo code exists in `src/components/data-table.tsx` with DnD, charts, drawers, tabs, and zod schema. If imported into production routes, it brings a heavy bundle.
- `QueryClient` is a module-level singleton in a client module. This is normal in browser context, but there are no default stale/cache settings.
- Client-side filtering over full arrays is fine for current list sizes but will not scale to thousands of children/classes/attempts without server pagination.
- Some page files include `console.log` in server components/actions, such as organization children page and CRUD actions.
- No virtualization is used in tables/lists.
- The root body background uses fixed radial gradients, which can be a paint cost on low-end devices.
- Organization fixed header plus `pt-28` is manually coordinated and may cause layout issues if header size changes.

Hydration concerns:

- Locale direction is set server-side, good.
- `suppressHydrationWarning` is set on body, which may hide legitimate hydration issues.
- Direct use of `next/navigation` in localized routes can produce non-locale paths after client navigation.

## 12. Technical Debt & Risks

High-risk debt:

- Inconsistent route spelling: `unautharized`, `unauthorized`, `email-verfication`, `verify-email`, `chose-role`. The app contains aliases in some places but not all.
- Encoding corruption/mojibake in many Arabic strings. This makes UI copy hard to maintain and can leak broken text to users.
- Committed secrets in `.env`.
- `next.config.ts` has `typescript.ignoreBuildErrors: true`, which can hide production-breaking type errors.
- Mixed API access: centralized API wrappers plus direct `fetch` in signup.
- Mixed toast systems: `sonner` and `react-toastify`.

Medium-risk debt:

- Multiple table implementations with the same `DataTable` name.
- Client/server auth gates duplicated across proxy, server components, and client components.
- Organization owner dashboard uses a different shell architecture from other dashboards.
- Some shared components import feature components, breaking layer boundaries.
- Query keys are not consistently centralized for all features.
- Many server action payloads cast raw `FormData` directly to domain types.

Accessibility risks:

- Some interactive elements use `<a href="#">` in sidebars.
- Some icon buttons have aria labels, but this is inconsistent.
- Custom cards/buttons with gradient styling should be checked for contrast.
- Table empty states are English-only in shared table components.

Scalability risks:

- Large cross-feature shared type files make API contract changes hard to isolate.
- List screens use client filtering on complete datasets.
- Role navigation is duplicated in middleware, redirects util, and sidebars.

## 13. Recommended Refactors

HIGH:

- Remove committed secrets and rotate `NEXTAUTH_SECRET`.
- Turn off `typescript.ignoreBuildErrors` after fixing type errors.
- Normalize auth/route constants and add aliases intentionally. Do not rename live routes without redirects.
- Move hardcoded Arabic copy into `messages/ar.json` and fix encoding.
- Make employee/enricher layouts use `RequireRoles` like admin/parent.
- Remove direct backend `fetch` from `SignupWizard`; route through `api.client` or a dedicated auth route handler.

MEDIUM:

- Consolidate table components. Keep one generic production `DataTable` and move the demo/DnD table out of shared production paths.
- Standardize mutation strategy by feature: server actions with revalidation for server-rendered CRUD, React Query mutations for client-owned flows.
- Centralize query keys for children/classes/grades/users, not only evaluations/notifications.
- Create a dashboard shell abstraction for sidebar-based roles.
- Extract role-to-dashboard mapping into one shared server/client-safe module used by proxy and redirect utilities.
- Replace raw `FormData` casts with Zod schemas for CRUD actions.

LOW:

- Add route-level `loading.tsx` and `error.tsx` for dashboards.
- Add server pagination for large tables/lists.
- Replace hardcoded colors with semantic tokens or named component variants.
- Add a proper theme provider/toggle if dark mode is product-supported.
- Remove unused imports and debug `console.log`.

## 14. AI Guidance Section

Future AI agents should follow these conventions.

Preferred file placement:

- New route: add a thin `page.tsx` under `src/app/[locale]/...`.
- New feature API: add to `src/features/<feature>/api/index.ts`.
- New client query hook: add to `src/features/<feature>/hooks/index.ts` with stable query keys.
- New server action: add to `src/features/<feature>/actions/*.action.ts`.
- New feature-specific UI: prefer `src/features/<feature>/components`.
- New app-wide reusable primitive: `src/components/ui` only if it is domain-free.
- New shared app pattern: `src/components/shared/<area>`.

Preferred rendering pattern:

```tsx
// page.tsx
export default async function Page({ params }: Props) {
  const { locale } = await params
  const data = await getSomething()
  return <SomeScreen locale={locale} data={data.items} />
}
```

```tsx
// SomeScreen.tsx
"use client"

export function SomeScreen({ locale, data }: Props) {
  // own search/filter/dialog state here
  // call server actions or feature React Query hooks here
}
```

API rules:

- Use `api.server` in server components/actions.
- Use `api.client` in client hooks/components.
- Add both server and client variants only when both rendering modes need them.
- Do not call `BACKEND_URL` or `NEXT_PUBLIC_API_URL` directly from random components.
- Watch for non-JSON or empty responses; current API wrappers expect JSON.

Auth rules:

- Trust `src/proxy.ts` for global route gating, but add `RequireRoles` to protected layouts for defense in depth.
- Use `useAuth()` for client auth state.
- Use `getServerSession(nextAuthOptions)` for server auth state.
- Never create a local user store; `auth-store.ts` is only re-export compatibility.

Routing rules:

- Use `Link`, `useRouter`, and `usePathname` from `@/i18n/navigation` when possible.
- Be careful with existing misspelled route segments. They are real route contracts.
- If adding a new role dashboard, update `src/proxy.ts`, `src/features/auth/utils/redirects.ts`, relevant sidebars, and `UserRole`.

Forms rules:

- Use `ServerActionForm` / `useServerActionForm` + registry config for new server-action CRUD forms.
- Validate all `FormData` server actions with Zod via `parseFormData`.
- Return i18n keys from server actions (`actionSuccess("Actions.entity.created")`); translate on the client with `useActionFeedback` or `showSuccessToast`.
- Use `src/components/ui/form.tsx` + `RhfFormFields` for field rendering.

Styling rules:

- Use shadcn primitives and semantic Tailwind tokens first.
- Use `cn()` from `src/lib/utils.ts`.
- Prefer translations over hardcoded bilingual strings.
- Preserve RTL behavior: root layout sets `dir`, but complex screens may still need explicit `dir`.
- Avoid adding more hardcoded gradients/colors unless matching an existing local screen pattern.

Dangerous areas:

- Auth redirect logic is duplicated. Change proxy and redirect utilities together.
- Evaluation attempt flow is stateful: `useEvaluationSession()` handles autosave, expiry, dirty state, and submission. Do not bypass it for the active runner.
- Notification query invalidation is broad and polling-based. Keep keys compatible with `notificationKeys`.
- Organization owner pages depend on `getCurrentOrganization()` and custom header/footer shell.
- Table imports are easy to confuse because multiple `DataTable` files exist.

Anti-patterns to avoid:

- Do not put feature imports inside `src/components/ui`.
- Do not add direct backend fetches in page/client components.
- Do not add new hardcoded Arabic source strings.
- Do not rely only on client-side `ProtectedRoute` for sensitive screens.
- Do not rename misspelled routes/enums without migration.
- Do not introduce a second global state library unless there is a clear app-wide state need.

Useful mental model:

```txt
App Router owns URL and initial render.
Proxy owns coarse auth/locale redirects.
NextAuth owns identity and tokens.
Feature API modules own backend communication.
React Query owns client server-state.
Server actions own many CRUD submissions.
Shared components own visual patterns, not domain rules.
```
