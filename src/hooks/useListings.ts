import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ListingsCache } from '@/utils/listingsCache';

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
      // First, try to get from localStorage cache
      const cachedFeatured = ListingsCache.getCachedListings(ListingsCache.KEYS.FEATURED_LISTINGS);
      
      try {
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
        
        const transformedData = (data || []).map(transformListing);
        
        // Cache the fresh data
        ListingsCache.cacheListings(ListingsCache.KEYS.FEATURED_LISTINGS, transformedData, CACHE_TIME);
        
        return transformedData;
      } catch (error) {
        // If network fails, return cached data if available
        if (cachedFeatured && cachedFeatured.length > 0) {
          console.log('Using cached featured listings due to network error');
          return cachedFeatured.map(transformListing);
        }
        throw error;
      }
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    // Use cached data as initial data for instant loading
    initialData: () => {
      const cached = ListingsCache.getCachedListings(ListingsCache.KEYS.FEATURED_LISTINGS);
      return cached && cached.length > 0 ? cached.map(transformListing) : undefined;
    },
  });
};

// Main listings hook with optimizations
export const useListings = () => {
  return useInfiniteQuery({
    queryKey: ['listings', 'all'],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * LISTINGS_PER_PAGE;
      const to = from + LISTINGS_PER_PAGE - 1;
      const cacheKey = `${ListingsCache.KEYS.ALL_LISTINGS}_page_${pageParam}`;

      // For first page, try to get from cache for instant loading
      const cachedPage = pageParam === 0 ? ListingsCache.getCachedListings(cacheKey) : null;

      try {
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

        const transformedListings = (data || []).map(transformListing);
        
        const result = {
          listings: transformedListings,
          nextPage: data && data.length === LISTINGS_PER_PAGE ? pageParam + 1 : undefined,
          hasMore: data && data.length === LISTINGS_PER_PAGE,
          totalCount: count,
        };

        // Cache the page data, especially first page for faster subsequent loads
        if (transformedListings.length > 0) {
          ListingsCache.cacheListings(cacheKey, transformedListings, CACHE_TIME);
          
          // Also cache first page as the main listings cache
          if (pageParam === 0) {
            ListingsCache.cacheListings(ListingsCache.KEYS.ALL_LISTINGS, transformedListings, CACHE_TIME);
          }
        }

        return result;
      } catch (error) {
        // If network fails and we have cached data for first page, use it
        if (pageParam === 0 && cachedPage && cachedPage.length > 0) {
          console.log('Using cached listings due to network error');
          return {
            listings: cachedPage.map(transformListing),
            nextPage: cachedPage.length === LISTINGS_PER_PAGE ? 1 : undefined,
            hasMore: cachedPage.length === LISTINGS_PER_PAGE,
            totalCount: null,
          };
        }
        throw error;
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    initialPageParam: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    // Use cached data as initial data for instant loading
    initialData: () => {
      const cached = ListingsCache.getCachedListings(ListingsCache.KEYS.ALL_LISTINGS);
      if (cached && cached.length > 0) {
        return {
          pages: [{
            listings: cached.map(transformListing),
            nextPage: cached.length === LISTINGS_PER_PAGE ? 1 : undefined,
            hasMore: cached.length === LISTINGS_PER_PAGE,
            totalCount: null,
          }],
          pageParams: [0],
        };
      }
      return undefined;
    },
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
      // Check cache first
      const cachedDetails = ListingsCache.getCachedListingDetails(id);
      
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        const transformedData = transformListing(data);
        
        // Cache the detailed listing
        ListingsCache.cacheListingDetails(id, transformedData, CACHE_TIME * 2);
        
        return transformedData;
      } catch (error) {
        // If network fails, return cached data if available
        if (cachedDetails) {
          console.log('Using cached listing details due to network error');
          return transformListing(cachedDetails);
        }
        throw error;
      }
    },
    enabled: !!id,
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME * 2,
    // Use cached data as initial data for instant loading
    initialData: () => {
      if (!id) return undefined;
      const cached = ListingsCache.getCachedListingDetails(id);
      return cached ? transformListing(cached) : undefined;
    },
  });
};
