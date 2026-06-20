-- Performance Optimization Indexes
-- Created on: 2024-05-22

-- Products Table: Speed up slug lookups and category filtering
CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);

-- Categories Table: Speed up slug lookups
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories (slug);

-- Blogs Table: Speed up slug lookups and date sorting
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs (slug);
CREATE INDEX IF NOT EXISTS idx_blogs_date ON blogs (date DESC);

-- Leads Table: Speed up date sorting and vendor assignment lookups
CREATE INDEX IF NOT EXISTS idx_leads_date ON leads (date DESC);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads (assigned_to);

-- Vendor Registrations: Speed up date sorting
CREATE INDEX IF NOT EXISTS idx_vendor_registrations_date ON vendor_registrations (date DESC);

-- Cities & States: Speed up slug lookups and hierarchy links
CREATE INDEX IF NOT EXISTS idx_cities_slug ON cities (slug);
CREATE INDEX IF NOT EXISTS idx_cities_state_id ON cities (state_id);
CREATE INDEX IF NOT EXISTS idx_states_slug ON states (slug);

-- Email Logs: Speed up vendor filtering and chronological sorting
CREATE INDEX IF NOT EXISTS idx_email_logs_vendor_id ON email_logs (vendor_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs (created_at DESC);

-- Users Table: Optimize role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
