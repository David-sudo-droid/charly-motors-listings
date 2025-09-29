-- Ensure listing_analytics table exists with correct structure
CREATE TABLE IF NOT EXISTS public.listing_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID,
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  last_viewed TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ensure user_favorites table exists with correct structure  
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  listing_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on tables
ALTER TABLE public.listing_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for listing_analytics
DROP POLICY IF EXISTS "Users can view analytics" ON public.listing_analytics;
CREATE POLICY "Users can view analytics" 
ON public.listing_analytics 
FOR SELECT 
USING (auth.role() = 'authenticated'::text);

DROP POLICY IF EXISTS "Users can insert analytics" ON public.listing_analytics;
CREATE POLICY "Users can insert analytics" 
ON public.listing_analytics 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated'::text);

-- Create RLS policies for user_favorites
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.user_favorites;
CREATE POLICY "Users can view their own favorites" 
ON public.user_favorites 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.user_favorites;
CREATE POLICY "Users can insert their own favorites" 
ON public.user_favorites 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.user_favorites;
CREATE POLICY "Users can delete their own favorites" 
ON public.user_favorites 
FOR DELETE 
USING (auth.uid() = user_id);

-- Ensure increment functions exist
CREATE OR REPLACE FUNCTION public.increment_view_count(listing_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO listing_analytics (listing_id, view_count, last_viewed)
  VALUES (listing_uuid, 1, NOW())
  ON CONFLICT (listing_id) 
  DO UPDATE SET 
    view_count = listing_analytics.view_count + 1,
    last_viewed = NOW();
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_inquiry_count(listing_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO listing_analytics (listing_id, inquiry_count)
  VALUES (listing_uuid, 1)
  ON CONFLICT (listing_id) 
  DO UPDATE SET 
    inquiry_count = listing_analytics.inquiry_count + 1;
END;
$function$;