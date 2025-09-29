import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getUserFavorites, addUserFavorite, removeUserFavorite } from '@/lib/supabase-helpers';

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
    try {
      const data = await getUserFavorites(userId);
      setFavorites(data.map((item: any) => item.listing_id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: "Error",
        description: "Failed to load favorites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
        await removeUserFavorite(userId, listingId);
        setFavorites(prev => prev.filter(id => id !== listingId));
        toast({
          title: "Removed from favorites",
          description: "Listing removed from your favorites",
        });
      } else {
        // Add favorite
        await addUserFavorite(userId, listingId);
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
