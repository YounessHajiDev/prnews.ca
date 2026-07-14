# PR NEWS — Production Readiness Audit

This document tracks findings, fixes, and verification status for the production-readiness pass.

## Part A — Correctness Audit

| # | Item | Status | Findings / Notes |
|---|------|--------|-------------------|
| 1 | Submission → editorial → distribution → live (EN/FR, single + bilingual) | **Fixed** | `SubmissionWizard` posts to `createRelease` server action; `createReleaseForUser` validates, debits credits, stores sanitized body, and returns the release. `approveRelease` publishes and writes `DistributionLog` entries. `scripts/audit.ts` verifies the public release page, JSON-LD, and sanitization end-to-end. |
| 2 | Stripe: one-time, subscription, cancel, failed card, webhook idempotency | **Fixed** | `/api/subscribe` supports `payment` (Starter) and `subscription` (Growth) modes. `/api/billing/portal` creates customer portal sessions. `/api/webhooks/stripe` verifies signatures, deduplicates via `ProcessedStripeEvent`, and updates `Subscription`/`CreditTransaction` for `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`, and `customer.subscription.deleted`. Live Stripe verification requires real keys. |
| 3 | Auth: signup, login, logout, reset, session expiry, role gating | **Fixed** | Credentials provider rate-limits login attempts. `signUp` and `requestPasswordReset` are rate-limited and validated with Zod. JWT sessions include `id` and `role`. Middleware protects `/app` and `/admin`; unauthenticated requests are redirected to `/login`, non-admin requests to `/`. Auth pages force dynamic rendering. |
| 4 | CASL unsubscribe: link, `unsubscribedAt` field, automated test | **Fixed** | `/api/unsubscribe?token=...` verifies `Subscriber.token`, sets `unsubscribedAt` on `Subscriber` and matching `User`, and redirects. `scripts/audit.ts` tests the flow. |
| 5 | Multi-tenant isolation (cross-company release access) | **Fixed** | `app/releases/[id]/analytics` checks `release.authorId !== session.user.id && !['ADMIN','EDITOR'].includes(session.user.role)`. All app/admin pages are protected by middleware and server-side session checks. |
| 6 | Empty/edge states: zero releases, zero credits, expired sub, oversized upload, long headline, non-Latin | **Fixed** | `createReleaseForUser` enforces credit balance and Zod length limits (headline ≤200, summary ≤500, body ≤50,000). `/api/upload` validates MIME type, 10 MB size limit, and origin. Empty `news`, `newsroom`, and dashboard states use `EmptyState` components. |

## Part B — Security Hardening

| # | Item | Status | Findings / Notes |
|---|------|--------|-------------------|
| 1 | Authorization on every API route | **Fixed** | `/api/upload`, `/api/newsletter`, `/api/stripe/checkout`, `/api/subscribe`, `/api/billing/portal` require session and origin checks. `/api/webhooks/stripe` uses signature verification. Middleware protects `/app` and `/admin` before rendering. |
| 2 | Input validation (Zod) + sanitize rich text before storage/render | **Fixed** | All server actions and API routes use Zod schemas. `sanitizeBody` (sanitize-html) runs at storage time in `createReleaseForUser` and at render time on public release pages. |
| 3 | Rate limiting on login, reset, contact, newsletter, autosave | **Fixed** | `src/lib/rate-limit.ts` provides Upstash Redis with in-memory fallback. Login, signup, password reset, newsletter, upload, release creation, Stripe endpoints, and billing portal are all rate-limited. |
| 4 | Secrets audit | **Fixed** | No hardcoded secrets in source. `.env.example` lists all required variables. `.env` is git-ignored. Git history should still be audited before public launch. |
| 5 | CSRF protection on state-changing routes | **Fixed** | `verifyOrigin` checks `Origin`/`Referer` against `NEXT_PUBLIC_SITE_URL` for `/api/newsletter`, `/api/upload`, `/api/stripe/checkout`, `/api/subscribe`. NextAuth provides CSRF for auth forms. Server actions use session validation. |
| 6 | Dependency audit | **In Progress** | Resolved all `npm audit` findings except one high-severity `next` advisory chain. That advisory requires upgrading to Next.js 15/16 (a breaking React 19 migration). Current status: **1 high (`next`)** remains. Overridable transitive deps (`undici`, `uuid`, `postcss`, `glob`) have been patched via `package.json` `overrides`. |
| 7 | File upload hardening | **Fixed** | `/api/upload` is implemented with MIME-type allowlist (images, PDF, common video), 10 MB size cap, auth, origin check, rate limit, and Vercel Blob/local fallback. The submission wizard media step uploads files and persists returned URLs as `MediaAsset` records. |
| 8 | Admin route protection | **Fixed** | Admin pages use `notFound()` for unauthorized sessions/roles. Middleware (`src/middleware.ts`) additionally enforces auth/role checks before any admin/app route renders. |

## Part C — Performance

| # | Item | Status | Findings / Notes |
|---|------|--------|-------------------|
| 1 | Lighthouse 90+ on home, release detail, pricing | Pending | No Lighthouse run yet. |
| 2 | Release detail ISR + on-demand revalidation | **Fixed** | Public release page uses `export const revalidate = 60`. Admin `approveRelease` revalidates `/en/news/...`, `/fr/news/...`, `/en/news/[category]`, and `/en/news`. |
| 3 | `next/image` everywhere | **Fixed** | Newsroom company logo uses `next/image`. No raw `<img>` warnings remain. Wizard uploaded-image previews intentionally use `<img>` for arbitrary external Blob URLs with an eslint disable. |
| 4 | Font loading via `next/font` | **Fixed** | `Playfair Display`, `Inter`, and `JetBrains Mono` are loaded via `next/font/google` in `[locale]/layout.tsx`. |
| 5 | No render-blocking third-party scripts above fold | **Fixed** | No analytics/chat widgets detected. |
| 6 | Bundle audit for server-only deps in client | Pending | Tiptap is used in the client wizard only; no obvious server bundle leakage. |

## Part D — SEO

| # | Item | Status | Findings / Notes |
|---|------|--------|-------------------|
| 1 | JSON-LD validation | **Fixed** | `lib/seo.ts` provides `NewsArticle`, `Organization`, and `BreadcrumbList` JSON-LD for release pages. |
| 2 | Sitemap index + child sitemaps at `/sitemap.xml` | **Fixed** | `src/app/sitemap.ts` returns static, release, newsroom, and category URLs with `alternates` languages. |
| 3 | `robots.txt` | **Fixed** | `src/app/robots.ts` disallows `/app`, `/admin`, `/api`, auth paths, and links to `/sitemap.xml`. |
| 4 | hreflang on bilingual releases | **Fixed** | `generateReleaseMetadata` returns `alternates.languages` for `en` and `fr`. Public release page metadata integrates it. |
| 5 | Canonical tags + trailing slash consistency | **Fixed** | Release metadata uses canonical URL. `NEXT_PUBLIC_SITE_URL` drives all absolute URLs. |
| 6 | `llms.txt` + semantic HTML | **Fixed** | `/llms.txt` route is implemented. Semantic HTML and ARIA roles are used throughout (e.g. `tabs.tsx` with `role="tablist"`, etc.). |
| 7 | OG/Twitter Card image on every release/newsroom | **Fixed** | Release pages generate OG image URLs via `/api/og?title=...` and include `openGraph.images` and `twitter.images`. |
| 8 | JSON-LD on newsroom and category pages | Pending | Could extend `lib/seo.ts` helpers to newsroom and category pages. |

## Part E — Compliance

| # | Item | Status | Findings / Notes |
|---|------|--------|-------------------|
| 1 | Cookie/consent banner gates tracking | Pending | No cookie banner or analytics yet. |
| 2 | Privacy/Terms real content | Pending | Pages exist; content needs legal review for real retention/processor details. |
| 3 | CASL page matches unsubscribe mechanism | **Fixed** | `/casl-compliance` page exists and `/api/unsubscribe` honors `Subscriber.unsubscribedAt`. |
| 4 | Accessibility audit (axe-core/Lighthouse) + keyboard wizard | Pending | No audit run. Wizard uses keyboard-focusable controls. |
| 5 | Contrast re-verification | Pending | Palette changed in v2; run contrast checks. |

## Part F — Reliability & Observability

| # | Item | Status | Findings / Notes |
|---|------|--------|-------------------|
| 1 | Custom 404/500 pages | **Fixed** | `src/app/[locale]/not-found.tsx` and `src/app/[locale]/error.tsx` use localized copy and Wire Room styling. |
| 2 | Error monitoring (Sentry/Vercel) | Pending | Not configured. |
| 3 | Stripe webhook retryability | **Fixed** | Webhook handler returns 500 on processing errors so Stripe retries. `ProcessedStripeEvent` table prevents duplicate processing. |
| 4 | DB backup strategy | Pending | Verify with hosting provider. |
| 5 | Uptime monitoring | Pending | Not configured. |
| 6 | Env variable separation (test/live Stripe keys) | **Fixed** | `.env.example` documents all variables. Build uses `DATABASE_URL`; no test Stripe keys in source. |

## Part G — Competitive Proof Points

| Claim | Must be true | Status |
|-------|--------------|--------|
| Transparent pricing, no sales call | All self-serve tiers complete checkout | **Verified locally** (Stripe checkout flow requires real keys for live test) |
| See where your story goes | Analytics distribution log shows real timestamps | **Verified** in audit |
| Genuinely bilingual | Every public page/error/transactional email in EN/FR | **UI fully localized**; user-submitted release content is not auto-translated |
| Fast editorial review | SLA countdown reflects real process | UI present; real SLA depends on operations |
| Faster site | Lighthouse beats newswire.ca | Pending |
| Accessible | WCAG AA compliance | Pending |

## Part H — Launch Gate

All launch gates are **not yet clear**. Remaining blockers before go-live:
1. Resolve or accept the `next` high-severity advisory (recommend scheduling Next.js 15/16 migration).
2. Add a cookie/consent banner if any analytics/tracking is enabled.
3. Replace placeholder legal copy with real Privacy Policy / Terms / CASL content.
4. Run Lighthouse and axe-core accessibility checks; fix any sub-90 or contrast failures.
5. Configure Sentry and uptime monitoring.
6. Verify Vercel production deploy with real `DATABASE_URL`, `NEXTAUTH_SECRET`, Stripe, Resend, and Blob env vars.

## Verification Summary

Local verification run (`npm run build`, `npx tsc --noEmit`, `npm run lint`) all pass.

`scripts/audit.ts` passes:
- Creates a release as a client
- Approves it as the system/admin
- Verifies the public page (HTTP 200, headline, JSON-LD, sanitized body, link preserved, script tag stripped)
- Verifies credit gating
- Verifies unsubscribe endpoint
- Verifies authenticated vs unauthenticated access to `/app` and `/admin/queue`

Dependency status after overrides: **1 high (`next`)** remains.

## Changelog

- Added `src/lib/services/releases.ts` for testable release CRUD, credit checks, sanitization, and approval/distribution.
- Added `src/lib/actions/releases.ts` as thin server-action wrappers.
- Added `src/lib/rate-limit.ts` (Upstash + in-memory fallback) and `src/lib/csrf.ts` origin verification.
- Added `src/lib/sanitize.ts` using `sanitize-html` for both storage and render-time XSS defense.
- Hardened auth: credentials login rate-limited, `signUp`/`requestPasswordReset` rate-limited, middleware auth wall for `/app` and `/admin`.
- Implemented Stripe checkout, billing portal, and webhook routes with signature verification and `ProcessedStripeEvent` idempotency.
- Implemented `/api/newsletter` and `/api/unsubscribe` with origin checks, rate limiting, and `unsubscribedAt` tracking.
- Implemented `/api/upload` with MIME-type validation, 10 MB size limit, auth, origin check, rate limit, Vercel Blob, and local fallback.
- Wired upload UI into the submission wizard; `MediaAsset` records are created with each release.
- Added `robots.ts`, `sitemap.ts`, `llms.txt`, `not-found.tsx`, and `error.tsx`.
- Updated `messages/en.json` and `messages/fr.json` for new UI copy.
- Added dependency overrides for `glob`, `postcss`, `undici`, and `uuid` to reduce audit surface.
- Wrote `PRODUCTION-AUDIT.md` to track status and remaining launch items.
