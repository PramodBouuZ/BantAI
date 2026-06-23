-- Core Tables Schema
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'vendor', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    price_range TEXT,
    features TEXT[],
    icon TEXT,
    rating DECIMAL DEFAULT 5,
    image TEXT,
    vendor_name TEXT,
    technical_specs TEXT[],
    -- SEO Fields
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    canonical_url TEXT,
    og_title TEXT,
    og_description TEXT,
    og_image TEXT,
    twitter_title TEXT,
    twitter_description TEXT,
    twitter_image TEXT,
    focus_keywords TEXT,
    seo_score INTEGER,
    schema_markup JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile TEXT,
    company TEXT,
    location TEXT,
    service TEXT,
    budget TEXT,
    requirement TEXT,
    authority TEXT,
    timing TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Verified', 'Sold', 'Rejected')),
    date DATE DEFAULT CURRENT_DATE,
    remarks TEXT,
    assigned_to UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    category TEXT,
    image TEXT,
    author TEXT,
    date DATE DEFAULT CURRENT_DATE,
    -- SEO Fields
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    canonical_url TEXT,
    og_title TEXT,
    og_description TEXT,
    og_image TEXT,
    twitter_title TEXT,
    twitter_description TEXT,
    twitter_image TEXT,
    focus_keywords TEXT,
    seo_score INTEGER,
    schema_markup JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.site_config (
    id INTEGER PRIMARY KEY DEFAULT 1,
    site_name TEXT DEFAULT 'BantConfirm',
    banner_title TEXT,
    banner_subtitle TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    whatsapp_number TEXT,
    admin_notification_email TEXT,
    social_links JSONB,
    -- SEO Fields
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    canonical_url TEXT,
    og_title TEXT,
    og_description TEXT,
    og_image TEXT,
    twitter_title TEXT,
    twitter_description TEXT,
    twitter_image TEXT,
    focus_keywords TEXT,
    seo_score INTEGER,
    schema_markup JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    -- SEO Fields
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    canonical_url TEXT,
    og_title TEXT,
    og_description TEXT,
    og_image TEXT,
    twitter_title TEXT,
    twitter_description TEXT,
    twitter_image TEXT,
    focus_keywords TEXT,
    seo_score INTEGER,
    schema_markup JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    state_id UUID,
    -- SEO Fields
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    canonical_url TEXT,
    og_title TEXT,
    og_description TEXT,
    og_image TEXT,
    twitter_title TEXT,
    twitter_description TEXT,
    twitter_image TEXT,
    focus_keywords TEXT,
    seo_score INTEGER,
    schema_markup JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    -- SEO Fields
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    canonical_url TEXT,
    og_title TEXT,
    og_description TEXT,
    og_image TEXT,
    twitter_title TEXT,
    twitter_description TEXT,
    twitter_image TEXT,
    focus_keywords TEXT,
    seo_score INTEGER,
    schema_markup JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.vendor_registrations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile TEXT,
    location TEXT,
    product_name TEXT,
    message TEXT,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.vendor_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    vendor_id UUID REFERENCES public.users(id),
    email TEXT NOT NULL,
    email_type TEXT NOT NULL,
    reference_id TEXT,
    status TEXT NOT NULL, -- 'sent', 'failed'
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata JSONB
);

-- RLS Policies
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- 1. Users Table Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- 2. Read-only Tables for Public (Products, Blogs, Site Config, Categories, Cities, States, Vendor Assets)
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Blogs are viewable by everyone" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Site config is viewable by everyone" ON public.site_config FOR SELECT USING (true);
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Cities are viewable by everyone" ON public.cities FOR SELECT USING (true);
CREATE POLICY "States are viewable by everyone" ON public.states FOR SELECT USING (true);
CREATE POLICY "Vendor assets are viewable by everyone" ON public.vendor_assets FOR SELECT USING (true);

-- 3. Leads Table Policies
CREATE POLICY "Leads can be created by anyone" ON public.leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all leads" ON public.leads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE public.users.id = auth.uid() AND public.users.role = 'admin'
        ) OR
        (SELECT email FROM auth.users WHERE id = auth.uid()) = 'info.bouuz@gmail.com'
    );

CREATE POLICY "Vendors can view assigned leads" ON public.leads
    FOR SELECT USING (assigned_to = auth.uid());

-- 4. Vendor Registrations (Anyone can register)
CREATE POLICY "Anyone can register as a vendor" ON public.vendor_registrations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view vendor registrations" ON public.vendor_registrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE public.users.id = auth.uid() AND public.users.role = 'admin'
        ) OR
        (SELECT email FROM auth.users WHERE id = auth.uid()) = 'info.bouuz@gmail.com'
    );

-- 5. Email Logs (Admin only)
CREATE POLICY "Admins can view email logs" ON public.email_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE public.users.id = auth.uid() AND public.users.role = 'admin'
        ) OR
        (SELECT email FROM auth.users WHERE id = auth.uid()) = 'info.bouuz@gmail.com'
    );

-- 6. Admin full access (Update/Delete/Insert on all tables)
-- For simplicity, adding a catch-all admin policy for all tables
-- In a real scenario, you'd add this per table.
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
    LOOP
        EXECUTE format('CREATE POLICY "Admins have full access on %I" ON public.%I ' ||
                       'FOR ALL USING ( ' ||
                       '  EXISTS (SELECT 1 FROM public.users WHERE public.users.id = auth.uid() AND public.users.role = ''admin'') ' ||
                       '  OR (SELECT email FROM auth.users WHERE id = auth.uid()) = ''info.bouuz@gmail.com'' ' ||
                       ')', t, t);
    END LOOP;
END $$;

-- Auth Trigger to create public.users entry
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
