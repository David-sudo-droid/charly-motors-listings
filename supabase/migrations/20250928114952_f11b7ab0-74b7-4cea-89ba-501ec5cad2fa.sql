-- Add database indexes for better search performance
-- These indexes will significantly improve query performance for the search functionality

-- Index for type-based queries (cars vs properties)
CREATE INDEX IF NOT EXISTS idx_listings_type ON public.listings(type);

-- Index for location-based searches
CREATE INDEX IF NOT EXISTS idx_listings_location ON public.listings USING gin(to_tsvector('english', location));

-- Index for price range filtering
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.listings(price);

-- Index for featured listings (priority display)
CREATE INDEX IF NOT EXISTS idx_listings_featured ON public.listings(featured, created_at DESC);

-- Index for title and description text search
CREATE INDEX IF NOT EXISTS idx_listings_text_search ON public.listings USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Index for chronological sorting
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at DESC);

-- Composite index for filtered searches (type + location + price)
CREATE INDEX IF NOT EXISTS idx_listings_search_composite ON public.listings(type, location, price, featured, created_at DESC);

-- Index for features array searches
CREATE INDEX IF NOT EXISTS idx_listings_features ON public.listings USING gin(features);

-- Index for specifications JSONB searches
CREATE INDEX IF NOT EXISTS idx_listings_specifications ON public.listings USING gin(specifications);