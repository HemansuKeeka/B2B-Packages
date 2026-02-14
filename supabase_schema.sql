
-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
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

-- 2. Packages Table
CREATE TABLE IF NOT EXISTS public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  benefits TEXT[] NOT NULL,
  price NUMERIC NOT NULL,
  stripe_price_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Purchases Table
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  stripe_checkout_session_id TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Packages Policies
CREATE POLICY "Packages are publicly readable" ON public.packages FOR SELECT USING (true);

-- Purchases Policies
CREATE POLICY "Users can view own purchases" ON public.purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can create purchases" ON public.purchases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pending purchases" ON public.purchases FOR UPDATE USING (auth.uid() = user_id);

-- Initial Mock Data
INSERT INTO public.packages (title, description, benefits, price, stripe_price_id) VALUES
('Starter Growth', 'Perfect for small businesses looking to scale their digital presence.', ARRAY['5 SEO Keywords', 'Monthly Analytics', 'Email Support'], 499, 'price_starter_123'),
('Business Pro', 'Advanced tools and dedicated support for established companies.', ARRAY['Unlimited SEO', 'Weekly Strategy Calls', 'Priority Support', 'Ad Campaign Management'], 1299, 'price_pro_456'),
('Enterprise Suite', 'Full-service management for large scale operations.', ARRAY['Dedicated Account Manager', 'Custom Integration', '24/7 Phone Support', 'On-site Training'], 3500, 'price_enterprise_789')
ON CONFLICT DO NOTHING;
