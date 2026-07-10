# PR NEWS (prnews.ca) — Master Build Prompt

## Mission
Build a Canadian press release distribution and media intelligence platform at prnews.ca — modern, faster, transparent alternative to PR Newswire/Cision for the Canadian market.

## Positioning
"See exactly where your story goes, before you hit send."
Full distribution-network transparency (live outlet count, syndication map, real-time delivery confirmation) is the wedge PR Newswire does not offer.

## Target Users
Canadian SMBs, agencies, startups, IR/IR teams, nonprofits, government/municipal comms, journalists (as consumers).

## Competitors
- newswire.ca (Cision) — audited July 2026, 2015-era layout
- EIN Presswire, openPR, PRLog, GlobeNewswire

## Tech Stack
- Next.js 14 (App Router), TypeScript strict mode
- Neon PostgreSQL via Prisma ORM
- NextAuth v5 (email/password + Google OAuth), roles: admin/editor/client/agency
- Stripe (subscriptions + credits)
- Resend (CASL-compliant transactional email)
- Vercel Blob (file storage)
- Tiptap (rich text editor)
- next-intl (path-based i18n: /en/, /fr/ — Québécois French)
- GA4 + first-party analytics
- Vercel deployment

## Database Models
User, Company, PressRelease, DistributionPartner, DistributionLog, MediaAsset, CreditTransaction, Subscription, AnalyticsEvent, JournalistProfile

## Design System: "Wire Room"
- Dark charcoal headers (#14161C), not navy
- Serif display + Inter body
- Amber accent color
- WCAG 2.1 AA
- Live wire ticker, Canada map, generous whitespace

## Key Differentiators vs PR Newswire
1. Self-serve, transparent pricing (no "Request Demo" wall)
2. Live distribution tracking (PR Newswire is opaque)
3. Branded evergreen newsroom pages per client
4. Real-time delivery confirmation per release
5. Genuine bilingual (EN/FR Québécois) from day one
6. Modern, fast, typographically confident design

## Phased Delivery
Phase 1: Foundation (Next.js scaffold, i18n, design system, Prisma, auth, homepage, category pages, release detail)
Phase 2: Submission & Editorial (wizard, editorial queue, distribution engine, client dashboard)
Phase 3: Monetization (Stripe, billing portal, pricing page)
Phase 4: SEO & Analytics (structured data, sitemaps, hreflang, GA4, per-release analytics, newsroom pages)
Phase 5: Polish (trending, journalist resources, resources hub, accessibility audit, Law 25/CASL compliance)
