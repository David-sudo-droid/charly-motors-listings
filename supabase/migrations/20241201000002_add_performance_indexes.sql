-- Add performance indexes for listings table
-- Index on type for filtering cars vs properties
CREATE INDEX IF NOT EXISTS idx_listings_type ON public.listings(type);

-- Index on featured for prioritizing featured listings
CREATE INDEX IF NOT EXISTS idx_listings_featured ON public.listings(featured DESC);

-- Composite index for featured + created_at (matches our ordering query)
CREATE INDEX IF NOT EXISTS idx_listings_featured_created_at ON public.listings(featured DESC, created_at DESC);

-- Index on created_at for general sorting
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at DESC);

-- Index on price for price range filtering
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.listings(price);

-- Index on location for location-based searches (using text pattern ops for partial matching)
CREATE INDEX IF NOT EXISTS idx_listings_location ON public.listings USING gin(to_tsvector('english', location));

-- Index on title for text search
CREATE INDEX IF NOT EXISTS idx_listings_title ON public.listings USING gin(to_tsvector('english', title));

-- Index on description for text search
CREATE INDEX IF NOT EXISTS idx_listings_description ON public.listings USING gin(to_tsvector('english', description));

-- Composite index for type + price (common filtering combination)
CREATE INDEX IF NOT EXISTS idx_listings_type_price ON public.listings(type, price);

-- Index on specifications for JSON queries (e.g., filtering by year, bedrooms)
CREATE INDEX IF NOT EXISTS idx_listings_specifications ON public.listings USING gin(specifications);

-- Vacuum analyze to update statistics after index creation
VACUUM ANALYZE public.listings;