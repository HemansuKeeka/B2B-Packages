-- 1. CLEANUP: Remove existing tables and policies to start fresh
DROP TABLE IF EXISTS public.purchases CASCADE;
DROP TABLE IF EXISTS public.packages CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Profiles Table: Stores extended user information linked to Supabase Auth
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  contact_number TEXT,
  business_name TEXT,
  business_address TEXT,
  business_website TEXT,
  linkedin_page TEXT,
  business_registration_number TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Packages Table: Available business service packages
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  benefits TEXT[] NOT NULL,
  price NUMERIC NOT NULL,
  stripe_payment_link TEXT NOT NULL, -- This stores the Stripe-generated Payment Link
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Purchases Table: Records purchase attempts and completed transactions
CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  stripe_checkout_session_id TEXT, 
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SECURITY: Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Packages RLS Policies
CREATE POLICY "Packages are publicly readable" ON public.packages FOR SELECT USING (true);

-- Purchases RLS Policies
CREATE POLICY "Users can view own purchases" ON public.purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can create purchases" ON public.purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Initial Mock Data
-- Replace the placeholder URLs below with your real Stripe Payment Links
INSERT INTO public.packages (title, description, benefits, price, stripe_payment_link) VALUES
(
    'Starter Growth', 
    'Perfect for small businesses looking to scale their digital presence.', 
    ARRAY['5 SEO Keywords', 'Monthly Analytics', 'Email Support'], 
    499, 
    'https://buy.stripe.com/test_your_starter_link'
),
(
    'Business Pro', 
    'Advanced tools and dedicated support for established companies.', 
    ARRAY['Unlimited SEO', 'Weekly Strategy Calls', 'Priority Support', 'Ad Campaign Management'], 
    1299, 
    'https://buy.stripe.com/test_your_pro_link'
),
(
    'Enterprise Suite', 
    'Full-service management for large scale operations.', 
    ARRAY['Dedicated Account Manager', 'Custom Integration', '24/7 Phone Support', 'On-site Training'], 
    3500, 
    'https://buy.stripe.com/test_your_enterprise_link'
)
ON CONFLICT DO NOTHING;