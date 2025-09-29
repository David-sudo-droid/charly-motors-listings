import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useFavorites = (userId: string | undefined) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchFavorites = async () => {
    if (!userId) {
      setFavorites([]);
      return;
    }
    
    setLoading(true);
    const { data, error } = await supabase
      .from('user_favorites')
      .select('listing_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: "Error",
        description: "Failed to load favorites",
        variant: "destructive",
      });
    } else if (data) {
      setFavorites(data.map(item => item.listing_id));
    }
    setLoading(false);
  };

  const toggleFavorite = async (listingId: string) => {
    if (!userId) {
      toast({
        title: "Login Required",
        description: "Please login to save favorites",
        variant: "destructive",
      });
      return false;
    }

    const isFavorited = favorites.includes(listingId);
    
    try {
      if (isFavorited) {
        // Remove favorite
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', userId)
          .eq('listing_id', listingId);
        
        if (error) throw error;
        
        setFavorites(prev => prev.filter(id => id !== listingId));
        toast({
          title: "Removed from favorites",
          description: "Listing removed from your favorites",
        });
      } else {
        // Add favorite
        const { error } = await supabase
          .from('user_favorites')
          .insert([{ user_id: userId, listing_id: listingId }]);
        
        if (error) throw error;
        
        setFavorites(prev => [...prev, listingId]);
        toast({
          title: "Added to favorites",
          description: "Listing saved to your favorites",
        });
      }
      return true;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
      return false;
    }
  };

  const isFavorite = (listingId: string) => {
    return favorites.includes(listingId);
  };

  useEffect(() => {
    fetchFavorites();
  }, [userId]);

  return { 
    favorites, 
    toggleFavorite, 
    isFavorite, 
    loading,
    refetchFavorites: fetchFavorites 
  };
};
