
# Setup Instructions

## 1. Supabase Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and paste the content of `supabase_schema.sql` to create tables and RLS policies.
3. Note your `Project URL` and `Anon Key` from **Project Settings > API**.
4. **CRITICAL**: Go to **Authentication > Providers > Email** and turn OFF "Confirm email". If this is ON, users cannot log in or create profiles until they click a verification link.

## 2. Stripe Setup
1. Create a Stripe account at [stripe.com](https://stripe.com).
2. Go to **Products** and create 3 products matching the packages in `supabase_schema.sql`.
3. Copy the **Price IDs** (e.g., `price_...`) and update the `packages` table in Supabase if needed.
4. Get your **Secret Key** and **Publishable Key** from Developers > API Keys.

## 3. Environment Variables
Add these to your project's environment configuration (Vercel, Netlify, or local `.env`):
- `SUPABASE_URL`: Your Supabase Project URL.
- `SUPABASE_ANON_KEY`: Your Supabase Anon Key.
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe Publishable Key.
- `STRIPE_SECRET_KEY`: Your Stripe Secret Key (for backend only).
- `STRIPE_WEBHOOK_SECRET`: Your Stripe Webhook Signing Secret (for backend only).

## 4. Webhook Deployment
1. Deploy a simple API endpoint using the logic in `webhook_example.ts`.
2. Configure Stripe to send `checkout.session.completed` events to your endpoint.

## 5. Development
1. Run `npm install`.
2. Run `npm start`.
3. Register a new business user to begin testing the flow.
