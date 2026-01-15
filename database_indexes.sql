
-- Recommended indexes for the 'products' table to enhance query performance.

-- Index for filtering products by their status (e.g., 'active', 'archived').
-- This is crucial for queries that only need to show active products.
CREATE INDEX idx_products_status ON products(status);

-- Index for ordering products by their creation date in descending order.
-- This will significantly speed up fetching the latest products.
CREATE INDEX idx_products_created_at_desc ON products(created_at DESC);

-- Index for quickly looking up a product by its unique slug.
-- This is essential for the product detail page.
CREATE UNIQUE INDEX idx_products_slug ON products(slug);

-- Index for filtering products by their category.
-- This will be used for the category filter on the product listing page
-- and for finding similar products on the product detail page.
CREATE INDEX idx_products_category_id ON products(category_id);
