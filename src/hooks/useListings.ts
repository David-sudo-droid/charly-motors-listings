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

const LISTINGS_PER_PAGE = 9; // Reduced from 12 for faster initial load

const transformListing = (item: any): Listing => ({
  id: item.id,
  type: item.type,
  title: item.title,
  price: item.price,
  currency: item.currency,
  location: item.location,
  images: item.images,
  description: item.description,
  features: item.features,
  specifications: item.specifications,
  whatsappNumber: item.whatsapp_number,
  featured: item.featured,
});

export const useListings = () => {
  return useInfiniteQuery({
    queryKey: ['listings'],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * LISTINGS_PER_PAGE;
      const to = from + LISTINGS_PER_PAGE - 1;

      // Select only necessary fields for better performance
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
          description,
          features,
          specifications,
          whatsapp_number,
          featured,
          created_at
        `)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        listings: (data || []).map(transformListing),
        nextPage: data && data.length === LISTINGS_PER_PAGE ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes (increased)
    gcTime: 20 * 60 * 1000, // Keep in memory for 20 minutes (increased)
    initialPageParam: 0,
    // Enable background refetching for better UX
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
