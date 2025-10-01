import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface FavoriteItem {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  listing: {
    id: string;
    type: 'car' | 'property';
    title: string;
    price: number;
    currency: string;
    location: string;
    images: string[];
    whatsapp_number: string;
    featured: boolean;
  };
}

const FAVORITES_STORAGE_KEY = 'user_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load favorites from localStorage for non-authenticated users
  useEffect(() => {
    if (!user) {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setFavorites(parsed);
        } catch (error) {
          console.error('Error parsing stored favorites:', error);
          localStorage.removeItem(FAVORITES_STORAGE_KEY);
        }
      }
    }
  }, [user]);

  // Fetch favorites from database for authenticated users
  const fetchFavorites = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          id,
          user_id,
          listing_id,
          created_at,
          listings!inner (
            id,
            type,
            title,
            price,
            currency,
            location,
            images,
            whatsapp_number,
            featured
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const items = (data || []).map(item => ({
        ...item,
        listing: item.listings
      })) as FavoriteItem[];

      setFavoriteItems(items);
      setFavorites(items.map(item => item.listing_id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: "Error loading favorites",
        description: "Could not load your saved listings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch favorites when user changes
  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavoriteItems([]);
    }
  }, [user]);

  // Save favorites to localStorage for non-authenticated users
  useEffect(() => {
    if (!user) {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  const toggleFavorite = async (listingId: string, listingData?: any) => {
    const isFavorited = favorites.includes(listingId);

    if (user) {
      // Authenticated user - save to database
      try {
        if (isFavorited) {
          // Remove from favorites
          const { error } = await supabase
            .from('user_favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('listing_id', listingId);

          if (error) throw error;

          setFavorites(prev => prev.filter(id => id !== listingId));
          setFavoriteItems(prev => prev.filter(item => item.listing_id !== listingId));
          
          toast({
            title: "Removed from favorites",
            description: "Listing removed from your saved items",
          });
        } else {
          // Add to favorites
          const { error } = await supabase
            .from('user_favorites')
            .insert({
              user_id: user.id,
              listing_id: listingId
            });

          if (error) throw error;

          setFavorites(prev => [...prev, listingId]);
          // Refresh the full list to get complete data
          fetchFavorites();
          
          toast({
            title: "Added to favorites",
            description: "Listing saved to your favorites",
          });
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
        toast({
          title: "Error",
          description: "Could not update favorites. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Non-authenticated user - save to localStorage
      if (isFavorited) {
        setFavorites(prev => prev.filter(id => id !== listingId));
        toast({
          title: "Removed from favorites",
          description: "Listing removed from your saved items",
        });
      } else {
        setFavorites(prev => [...prev, listingId]);
        toast({
          title: "Added to favorites",
          description: "Listing saved to your favorites (sign in to sync across devices)",
        });
      }
    }
  };

  const clearAllFavorites = async () => {
    if (user) {
      try {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;

        setFavorites([]);
        setFavoriteItems([]);
        
        toast({
          title: "All favorites cleared",
          description: "All saved listings have been removed",
        });
      } catch (error) {
        console.error('Error clearing favorites:', error);
        toast({
          title: "Error",
          description: "Could not clear favorites. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      setFavorites([]);
      toast({
        title: "All favorites cleared",
        description: "All saved listings have been removed",
      });
    }
  };

  const isFavorited = (listingId: string) => {
    return favorites.includes(listingId);
  };

  return {
    favorites,
    favoriteItems,
    isLoading,
    toggleFavorite,
    clearAllFavorites,
    isFavorited,
    count: favorites.length,
    isAuthenticated: !!user,
  };
};
