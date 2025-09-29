-- Fix security warnings by updating functions with proper search_path

-- Update increment_view_count with proper search_path
CREATE OR REPLACE FUNCTION public.increment_view_count(listing_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Update increment_inquiry_count with proper search_path
CREATE OR REPLACE FUNCTION public.increment_inquiry_count(listing_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO listing_analytics (listing_id, inquiry_count)
  VALUES (listing_uuid, 1)
  ON CONFLICT (listing_id) 
  DO UPDATE SET 
    inquiry_count = listing_analytics.inquiry_count + 1;
END;
$function$;

-- Update get_total_users_count with proper search_path
CREATE OR REPLACE FUNCTION public.get_total_users_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN (SELECT COUNT(*) FROM auth.users);
END;
$function$;