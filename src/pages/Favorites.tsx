import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavorites';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ListingCard from '@/components/ListingCard';
import ListingModal from '@/components/ListingModal';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Listing {
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

const Favorites = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { favorites, toggleFavorite, loading: favoritesLoading } = useFavorites(user?.id);
  
  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=favorites');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && favorites.length > 0) {
      fetchFavoriteListings();
    } else {
      setFavoriteListings([]);
      setLoading(false);
    }
  }, [user, favorites]);

  const fetchFavoriteListings = async () => {
    if (!user || favorites.length === 0) {
      setFavoriteListings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .in('id', favorites)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch favorite listings",
        variant: "destructive",
      });
    } else {
      const transformedData = (data || []).map((item: any) => ({
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
      }));
      setFavoriteListings(transformedData);
    }
    setLoading(false);
  };

  const handleViewDetails = (listing: Listing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedListing(null);
  };

  const handleClearAllFavorites = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to clear favorites",
        variant: "destructive",
      });
    } else {
      setFavoriteListings([]);
      toast({
        title: "Success",
        description: "All favorites cleared",
      });
    }
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );

  if (authLoading || favoritesLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-4 w-64 mb-4" />
          </div>
          <LoadingSkeleton />
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
                <Heart className="h-8 w-8 text-red-500" />
                My Favorites
              </h1>
              <p className="text-muted-foreground">
                {favoriteListings.length === 0 
                  ? "You haven't saved any favorites yet" 
                  : `You have ${favoriteListings.length} saved listing${favoriteListings.length !== 1 ? 's' : ''}`
                }
              </p>
            </div>
            
            {favoriteListings.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear all favorites?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently remove all saved listings from your favorites.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearAllFavorites}>
                      Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Content */}
        {favoriteListings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start browsing our listings and save your favorites by clicking the heart icon on any listing card.
            </p>
            <Button onClick={() => navigate('/')}>
              Browse Listings
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedListing && (
          <ListingModal
            listing={selectedListing}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </main>
    </div>
  );
};

export default Favorites;
