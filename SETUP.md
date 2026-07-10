# PR NEWS Setup

## Quick Start

1. Clone the repo
2. Copy `.env.example` to `.env.local` and fill in your credentials
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```
5. Start the dev server:
   ```bash
   npm run dev
   ```

## Required Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret for NextAuth (use `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `http://localhost:3000` for dev |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `STRIPE_SECRET_KEY` | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `RESEND_API_KEY` | Resend email API key |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token |

## Setup Steps

1. **Create a Neon project** at https://neon.tech
2. **Set up Google OAuth** at https://console.cloud.google.com/apis/credentials
3. **Create a Stripe account** at https://dashboard.stripe.com
4. **Create a Resend account** at https://resend.com
5. **Create a Vercel account** for deployment and Blob storage

## Running Locally

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
```

## Database

```bash
npx prisma studio           # Open Prisma Studio GUI
npx prisma migrate dev      # Create and apply migration
npx prisma db push          # Push schema to database (dev only)
npx prisma db seed          # Run seed script
```
