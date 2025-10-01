import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Listing {
  id: string;
  type: 'car' | 'property';
  title: string;
  price: number;
  currency: string;
  location: string;
  images: string[];
  description: string | null;
  features: string[];
  specifications: any;
  whatsappNumber: string;
  featured: boolean;
}

const LISTINGS_PER_PAGE = 9; // Smaller initial load for faster first paint
const CACHE_TIME = 30 * 60 * 1000; // 30 minutes cache
const STALE_TIME = 10 * 60 * 1000; // 10 minutes stale time

const transformListing = (item: any): Listing => ({
  id: item.id,
  type: item.type,
  title: item.title,
  price: item.price,
  currency: item.currency,
  location: item.location,
  images: item.images || [], // Ensure images is always an array
  description: item.description,
  features: item.features || [], // Ensure features is always an array
  specifications: item.specifications || {},
  whatsappNumber: item.whatsapp_number,
  featured: item.featured || false,
});

// Separate hook for featured listings (loads first)
export const useFeaturedListings = () => {
  return useQuery({
    queryKey: ['listings', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          id,
          type,
          title,
          price,
          currency,
          location,
          images,
          whatsapp_number,
          featured,
          created_at
        `)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(3); // Only get first 3 featured items

      if (error) throw error;
      return (data || []).map(transformListing);
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

// Main listings hook with optimizations
export const useListings = () => {
  return useInfiniteQuery({
    queryKey: ['listings', 'all'],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * LISTINGS_PER_PAGE;
      const to = from + LISTINGS_PER_PAGE - 1;

      // Heavily optimized query - only essential fields for list view
      const { data, error, count } = await supabase
        .from('listings')
        .select(`
          id,
          type,
          title,
          price,
          currency,
          location,
          images,
          whatsapp_number,
          featured
        `, { count: pageParam === 0 ? 'estimated' : null })
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        listings: (data || []).map(transformListing),
        nextPage: data && data.length === LISTINGS_PER_PAGE ? pageParam + 1 : undefined,
        hasMore: data && data.length === LISTINGS_PER_PAGE,
        totalCount: count,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    initialPageParam: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    // Prefetch next page for smoother experience
    getPreviousPageParam: (firstPage, allPages) => 
      allPages.length > 1 ? allPages.length - 2 : undefined,
  });
};

// Hook for individual listing details (lazy loaded)
export const useListingDetails = (id: string) => {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return transformListing(data);
    },
    enabled: !!id,
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME * 2,
  });
};
