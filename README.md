# Load Shedding & Power Management — `lsms` Frontend

A modern web application for managing load shedding schedules, outages, and
power distribution activities. Built with **Next.js 16 (App Router)**,
**React 19**, **TypeScript**, and **Tailwind CSS 4**, this frontend pairs with
a RESTful backend to deliver a role-aware experience for customers, field
operators, zone managers, and super admins.

> **Status:** Active development — see [`AGENTS.md`](./AGENTS.md) for project
> agent conventions and contribution notes.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Application Routes](#application-routes)
- [Authentication & Roles](#authentication--roles)
- [API Surface](#api-surface)
- [UI & Styling](#ui--styling)
- [State Management](#state-management)
- [Deployment](#deployment)
- [Learn More](#learn-more)

---

## Features

- **Role-based dashboards** — `CUSTOMER`, `FIELD_OPERATOR`, `ZONE_MANAGER`,
  and `SUPER_ADMIN` each get their own navigation and tooling.
- **Authentication** — Email/password login & registration, Google OAuth,
  forgot/reset password flows, and JWT-based session management with
  automatic access-token refresh.
- **Load shedding schedules** — Browse, filter (`zone`, `status`, `date`),
  view personal schedules, and inspect individual schedule detail with slots,
  submit / approve / reject / activate lifecycle actions.
- **Outages** — Surface active and historical power outages.
- **Payments** — Payment information module (API-backed).
- **Profile & account** — View account details such as role, job type, zone,
  and area.
- **Responsive shell** — Collapsible sidebar with mobile support.
- **Light / dark / system theme** — Powered by `next-themes`.
- **Accessible UI primitives** — Built with `shadcn` (base-luma style) over
  Radix-style components.
- **Form validation** — Schema-driven forms via `zod` and `@tanstack/react-form`.
- **Toast notifications** — Provided by `sonner`.

---

## Tech Stack

| Layer            | Technology                                                  |
| ---------------- | ----------------------------------------------------------- |
| Framework        | [Next.js 16](https://nextjs.org) (App Router, RSC)          |
| Language         | TypeScript 5                                                |
| UI               | React 19                                                    |
| Styling          | Tailwind CSS 4 (`@tailwindcss/postcss`)                     |
| Components       | `shadcn` (`base-luma`), Radix-style UI (`@base-ui/react`)    |
| Icons            | `lucide-react`, `@remixicon/react`                          |
| Forms            | `@tanstack/react-form` + `zod`                              |
| Data fetching    | `@tanstack/react-query` + `ofetch`                          |
| Theming          | `next-themes`                                               |
| Toasts           | `sonner`                                                    |
| Validation       | `zod`                                                       |
| Package Manager  | `pnpm` (`pnpm@11.20.0`)                                     |

---

## Project Structure

```
lsms/
├── app/                            # Next.js App Router entry
│   ├── globals.css                 # Tailwind layer & global styles
│   ├── layout.tsx                  # Root layout (providers, fonts, shell)
│   ├── page.tsx                    # Landing page
│   ├── (auth)/                     # Auth route group
│   │   ├── _features/              # Auth domain: api, hook, schema, types, provider
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── (dashboard)/                # Authenticated route group
│       ├── _config/navigation.ts   # Per-role navigation items
│       ├── _components/            # Header, sidebar, schedule components
│       ├── _features/schedules/     # Schedule domain: api, hook, types
│       └── dashboard/              # Dashboard layout + pages
│           ├── layout.tsx
│           ├── page.tsx            # Overview
│           └── schedules/page.tsx
├── components/
│   ├── ui/                         # shadcn primitives (button, card, input, ...)
│   ├── form/                       # Login & register forms
│   ├── layout/                     # Navbar, footer, site shell
│   └── theme/                      # Theme toggle
├── constants/
│   └── api.ts                      # Centralized API route map
├── lib/
│   ├── api/                        # `ofetch`-based client + types/errors
│   └── utils.ts                    # `cn` and small helpers
├── providers/                      # Theme & React Query providers
├── public/                         # Static assets
├── .env                            # Local environment variables (do not commit)
├── components.json                 # shadcn configuration
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── eslint.config.mjs
├── package.json
└── pnpm-workspace.yaml
```

---

## Getting Started

### Prerequisites

- **Node.js 20+**
- **pnpm 11.20.0** (pinned via `packageManager` in `package.json`)

  ```bash
  corepack enable
  corepack prepare pnpm@11.20.0 --activate
  ```

### Install

```bash
pnpm install
```

### Configure environment

Create a `.env` file at the project root (see [Environment Variables](#environment-variables)):

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/
JWT_ACCESS_SECRET=...              # server-only
JWT_REFRESH_SECRET=...              # server-only
GOOGLE_CLIENT_ID=...               # Google OAuth client ID
```

### Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app. The
backend should be reachable at the URL set by `NEXT_PUBLIC_API_URL`.

---

## Environment Variables

| Variable                | Required | Scope         | Description                                              |
| ----------------------- | -------- | ------------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`   | Yes      | Client + SSR  | Base URL of the backend API (without `/api/v1`).         |
| `JWT_ACCESS_SECRET`     | Yes      | Server only   | Secret used to sign access tokens server-side.           |
| `JWT_REFRESH_SECRET`    | Yes      | Server only   | Secret used to sign refresh tokens server-side.          |
| `GOOGLE_CLIENT_ID`      | Yes      | Client        | Google OAuth client ID used for the Google sign-in flow. |

> **Important:** `.env` is intended for local development only. In your hosting
> provider, configure the equivalent secrets there instead of committing them.

---

## Available Scripts

```bash
pnpm dev      # Start the Next.js development server on port 3000.
pnpm build    # Produce a production build.
pnpm start    # Serve the production build.
pnpm lint     # Run ESLint with the Next.js config.
```

---

## Application Routes

### Public

| Path          | Description                                                              |
| ------------- | ------------------------------------------------------------------------ |
| `/`           | Landing page.                                                            |
| `/login`      | Email/password login.                                                    |
| `/register`   | New user registration.                                                   |

### Authenticated (`(dashboard)` route group)

| Path                       | Description                                            |
| --------------------------- | ------------------------------------------------------ |
| `/dashboard`                | Overview with status cards and account info.         |
| `/dashboard/schedules`      | Load shedding schedules (filterable).                 |
| `/dashboard/outages`         | Active and historical outages.                        |
| `/dashboard/payments`       | Payment information.                                  |
| `/dashboard/profile`        | Current user profile.                                 |
| `/dashboard/assignments`    | Field-operator / zone-manager assignments.           |
| `/dashboard/team`           | Zone-manager team management.                          |
| `/dashboard/users`           | Super-admin user management.                          |
| `/dashboard/zones`          | Super-admin zone management.                         |
| `/dashboard/settings`       | Super-admin settings.                                 |

> The exact visible navigation is filtered by the user's role via
> `app/(dashboard)/_config/navigation.ts`.

---

## Authentication & Roles

Authentication is implemented in `app/(auth)/_features/`:

- **`auth.api.ts`** — Wraps backend endpoints for login, register, logout,
  refresh, forgot/reset password, Google OAuth, and "me".
- **`auth.hook.ts`** — React Query hooks (`useGetMe`, query keys, etc.).
- **`auth.provider.tsx`** — Exposes `useAuth()` with `user`, `isLoading`,
  `isAuthenticated`, and `logout`. On logout, it clears the React Query
  cache and redirects to `/login`.
- **`auth.schima.ts` / `auth.types.ts`** — `zod` schemas and TypeScript types
  (including the `UserRole` union: `CUSTOMER`, `FIELD_OPERATOR`,
  `ZONE_MANAGER`, `SUPER_ADMIN`).

### Access token refresh

`getMe()` automatically attempts a one-time refresh on failure, so expired
access tokens are transparently renewed when a refresh token is still
valid.

### Role-aware UI

`roleNavigation` in `app/(dashboard)/_config/navigation.ts` defines the
navigation items per role. The dashboard sidebar and mobile sidebar render
only the items that apply to the current user.

---

## API Surface

All routes are versioned under `/api/v1` and centralized in
[`constants/api.ts`](./constants/api.ts):

```ts
API_ROUTES = {
  auth: {
    register, login, google, refreshToken, logout,
    forgotPassword, resetPassword, me,
  },
  loadShedding: {
    schedules, mySchedule,
    scheduleById(id), scheduleSlots(id), createSlot(id),
    deleteSlot(id),
    submit(id), approve(id), reject(id), activate(id),
  },
  outages: { base },
  payments: { base },
}
```

The HTTP client (`lib/api/client.ts`) is built on `ofetch` and returns
`ApiResponse<T>` envelopes (see `lib/api/types.ts` and `lib/api/errors.ts`).

---

## UI & Styling

- **Tailwind CSS 4** with the `@tailwindcss/postcss` plugin
  (`postcss.config.mjs`).
- **shadcn** in the `base-luma` style with the `remixicon` icon library
  (see `components.json`).
- **Global styles** in [`app/globals.css`](./app/globals.css).
- **Theme toggle** uses `next-themes` with light/dark/system support.
- **Fonts** — `Raleway`, `Geist`, and `Geist Mono` via `next/font/google`,
  applied through the `--font-sans` / `--font-geist-*` CSS variables.
- **Toasts** — `sonner`, mounted in the root layout.

---

## State Management

- **Server state** is handled exclusively with React Query (`QueryProvider`
  in `providers/query-provider.tsx`). Hooks like `useGetMe` and the
  schedule hooks return query objects so consumers can compose loading and
  error states declaratively.
- **Form state** uses `@tanstack/react-form` with `zod` schemas for
  validation. Form values are inferred from the schema.
- **Auth context** — `AuthProvider` exposes a memoized context that tracks
  the current user and triggers logout-driven cache cleanup.
- **Theme state** — delegated to `next-themes` (system / light / dark).

---

## Deployment

This is a standard Next.js application and can be deployed anywhere that
supports Node.js or edge runtimes.

### Vercel (recommended for Next.js)

```bash
npx vercel
```

Then configure the four secrets listed in [Environment Variables](#environment-variables)
in your Vercel project settings.

### Self-hosted / Docker

1. `pnpm build`
2. `pnpm start` (binds to `0.0.0.0:3000` by default; override with the
   standard `PORT` / `HOSTNAME` environment variables).
3. Make sure the backend reachable at `NEXT_PUBLIC_API_URL` is reachable
   from your users.

For more details, see the
[Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [TanStack Query](https://tanstack.com/query/latest)
- [TanStack Form](https://tanstack.com/form/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [zod](https://zod.dev/)
- [sonner](https://sonner.emilkowal.ski/)

---

## License

This project is private and not yet licensed for public distribution.