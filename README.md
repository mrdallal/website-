# TECHSIDES

Public agency website + private operating system ("TECHSIDES OS") in one Next.js application.

```
TECHSIDES WEBSITE  →  LEAD  →  NODE.JS BACKEND  →  POSTGRESQL  →  GHL / EMAIL / AUTOMATION  →  TECHSIDES OS
```

## Stack

- **Next.js 16** (App Router, Turbopack, Server Actions, Route Handlers) · React 19 · TypeScript strict
- **Tailwind CSS v4** with design tokens in `src/app/globals.css` · Radix primitives · Lucide icons · Sonner toasts
- **PostgreSQL + Prisma 7** (`prisma-client` generator, `@prisma/adapter-pg`)
- **Auth.js v5** (credentials + JWT sessions, role-based authorization)
- **Zod v4** validation on client and server
- **Resend** email + **GoHighLevel** integration behind service abstractions
- Vercel-compatible; no microservices, no queues (yet)

## Quick start

```bash
pnpm install
cp .env.example .env        # then edit values
pnpm db:dev                 # local Postgres (Prisma Dev) — leave running, or use any DATABASE_URL
pnpm db:migrate             # apply migrations
pnpm db:seed                # creates the admin user from ADMIN_EMAIL / ADMIN_PASSWORD
pnpm dev                    # http://localhost:3000
```

Sign in at `/login` with the seeded admin credentials, then open `/dashboard`.

### Scripts

| Script          | Purpose                                                       |
| --------------- | ------------------------------------------------------------- |
| `pnpm dev`      | Development server                                            |
| `pnpm build`    | `prisma generate` + production build                          |
| `pnpm start`    | Serve the production build                                    |
| `pnpm typecheck`| `tsc --noEmit`                                                |
| `pnpm lint`     | ESLint (Next core-web-vitals + TypeScript rules)              |
| `pnpm db:dev`   | Start a local Prisma Postgres server (no Docker needed)       |
| `pnpm db:migrate` / `db:deploy` | Migrations (dev / production)                 |
| `pnpm db:seed`  | Seed admin user + default settings (no fake data)             |
| `pnpm db:studio`| Prisma Studio                                                 |
| `pnpm qa:smoke` | Signs in with the seeded admin, visits pages, reports errors  |
| `pnpm qa:flows` | End-to-end flow: lead form → login → lead → client → project → task → settings |

QA scripts use `playwright-core` with the locally installed Chrome (`channel: "chrome"`) and expect `pnpm dev` to be running.

## Environment variables

See `.env.example`. Only `DATABASE_URL`, `AUTH_SECRET` and the `ADMIN_*` seed values are required. Everything else is optional and the app degrades gracefully:

| Variable | Effect when missing |
| --- | --- |
| `RESEND_API_KEY`, `NOTIFY_EMAIL` | Emails are skipped and logged |
| `GHL_API_KEY`, `GHL_LOCATION_ID` | GHL contact/opportunity steps are skipped |
| `GHL_WEBHOOK_URL` | Outbound webhook skipped |
| `GHL_WEBHOOK_SECRET` | Inbound `/api/webhooks/ghl` returns 503 |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` + id | No third-party script is loaded; dashboard shows "connect a provider" |

Secrets exist only on the server. Nothing in `src/lib/env.ts` is imported by client components.

## Project structure

```
prisma/               schema.prisma, migrations/, seed.ts
scripts/              qa-smoke.mjs, qa-flows.mjs
src/
  app/
    (marketing)/      /, /services, /work, /about, /contact, /case-studies/[slug]
    (auth)/login
    dashboard/        overview, leads, clients, projects, tasks, analytics, content, automations, settings
    api/              leads, leads/[id], contact, projects, projects/[id], dashboard/stats, webhooks/ghl, auth/[...nextauth]
    robots.ts, sitemap.ts, icon.svg, opengraph-image.tsx, not-found.tsx, error.tsx
  components/
    ui/               Button, Container, Section, SectionLabel, SectionHeading, Badge, StatusBadge, FormField,
                      Dialog, ConfirmDialog, Accordion, DataTable, EmptyState, Toaster, DropdownMenu, Tabs, Skeleton
    marketing/        Navbar, Footer, Hero, sections, ServiceCard, ProjectCard, Reveal, Marquee
    forms/            LeadForm
    dashboard/        Sidebar, PageHeader, DashboardCard, StatBlock, ActivityFeed, tables, forms, TaskBoard
  content/            site, home, services, projects (case studies), faqs, process, about, lead-options
  lib/
    auth/             Auth.js config, session helpers (requireUser / requireAdmin / requireApiUser)
    db/               Prisma client
    validation/       Zod schemas (lead, project, task, client, auth, settings)
    services/         leads, lead-intake, projects, tasks, clients, users, activities, settings, stats, automations
    integrations/     ghl.ts (GHLService), email.ts (Resend)
    analytics/        config (client-safe), server (first-party events + summary)
    security/         rate-limit, request (IP hashing), sanitize
  proxy.ts            Edge auth check for /dashboard
  types/              content, dashboard, next-auth augmentation
```

## How a lead flows

1. Visitor submits the form on `/contact` (client-side Zod validation first).
2. Server Action `submitLeadAction` (or `POST /api/leads`) → `submitPublicLead`:
   rate limit per hashed IP → Zod validation → honeypot / timing checks.
3. `createLead` sanitises and stores the lead in PostgreSQL, records an activity and a first-party analytics event.
4. After the response is sent (`after()`), `runLeadCreatedAutomations` runs isolated steps:
   GHL contact → GHL opportunity → GHL webhook → team notification email → confirmation email.
   Each step is logged to the lead timeline; failures never affect the visitor.
5. The lead appears immediately in TECHSIDES OS with status `NEW`.

## Content

All marketing copy lives in `src/content/*.ts` and is typed in `src/types/content.ts`. Components read from these files; changing copy never requires touching a component.

**Placeholders to replace before launch** (also listed in Dashboard → Content):

- Case studies in `src/content/projects.ts` are marked `placeholder: true` and render a visible "Placeholder" badge. They are excluded from the sitemap.
- `siteConfig.contactEmail` in `src/content/site.ts`.
- Cover images in `public/images/work/`.
- Client logos / social links (the capability band is shown until real logos exist).

No fake statistics, testimonials, clients or awards are included anywhere.

## Security notes

- All admin routes and API endpoints check the session server-side (`requireApiUser` / `requireApiAdmin`); the proxy is only an optimistic redirect.
- Public endpoints are rate limited (in-memory store; swap `RateLimitStore` for Redis on multi-instance deployments), validated with Zod, and protected by a honeypot and a minimum fill time.
- Passwords are hashed with bcrypt; login attempts are throttled per email + IP.
- Internal errors are logged and never returned to clients; API responses use a uniform `{ ok, data | error }` shape.
- Security headers are set in `next.config.ts`.

## Deployment (Vercel)

1. Provision PostgreSQL (Neon, Supabase, Prisma Postgres, RDS…) and set `DATABASE_URL`.
2. Set `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, `AUTH_TRUST_HOST=true`, and optional integration keys.
3. Run `pnpm db:deploy` against the production database, then `pnpm db:seed` once.
4. Deploy. The build runs `prisma generate` automatically.

## Roadmap hooks

- `/case-studies/[slug]` already exists; `/blog` and `/resources` follow the same content-file pattern.
- Move `runLeadCreatedAutomations` steps to a queue/worker when volume requires it.
- File storage for projects (S3 / Vercel Blob) — the Files tab is a placeholder.
