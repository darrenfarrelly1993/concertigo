# Concertigo — Next.js

## Setup

```bash
npm install
npm run dev
```

## Supabase — add one column
Run in SQL Editor:
```sql
alter table profiles add column if not exists venue_paid boolean default false;
```

## Update email confirmation URL
In Supabase → Authentication → URL Configuration:
- Site URL: `https://www.concertigo.ie`
- Redirect URLs: `https://www.concertigo.ie/auth/callback`

## Deploy to Vercel
1. Push to GitHub
2. Import in Vercel
3. Add environment variables from `.env.local`
4. Deploy

## Environment Variables needed in Vercel
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (from Supabase → Settings → API)
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_APP_URL=https://www.concertigo.ie`

## Project structure
```
app/
  page.tsx              # Landing page
  musicians/
    page.tsx            # Browse musicians
    [id]/page.tsx       # Individual profile (real URL!)
  login/page.tsx
  signup/page.tsx
  profile/me/page.tsx   # Edit profile
  dashboard/page.tsx    # Venue dashboard
  messages/page.tsx
  auth/callback/route.ts
  api/
    checkout/route.ts   # Stripe €15 payment
    webhook/route.ts    # Stripe webhook
components/
  layout/Nav.tsx
  musicians/
  profile/
  messages/
lib/supabase/
  client.ts
  server.ts
middleware.ts           # Auth protection
```
