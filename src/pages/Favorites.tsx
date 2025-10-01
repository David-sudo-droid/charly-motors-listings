import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import ListingCard from '@/components/ListingCard';
import ListingModal from '@/components/ListingModal';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ArrowLeft, LogIn, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { type Listing } from '@/hooks/useListings';

const Favorites = () => {
  const { user } = useAuth();
  const { favoriteItems, isLoading, clearAllFavorites, count, isAuthenticated } = useFavorites();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (listing: any) => {
    // Convert favorite item to listing format
    const listingData: Listing = {
      id: listing.listing?.id || listing.id,
      type: listing.listing?.type || listing.type,
      title: listing.listing?.title || listing.title,
      price: listing.listing?.price || listing.price,
      currency: listing.listing?.currency || listing.currency || 'KES',
      location: listing.listing?.location || listing.location,
      images: listing.listing?.images || listing.images || [],
      description: listing.listing?.description || listing.description || null,
      features: listing.listing?.features || listing.features || [],
      specifications: listing.listing?.specifications || listing.specifications || {},
      whatsappNumber: listing.listing?.whatsapp_number || listing.whatsapp_number || '',
      featured: listing.listing?.featured || listing.featured || false,
    };
    setSelectedListing(listingData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedListing(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto text-gray-400 animate-pulse mb-4" />
              <p className="text-gray-600">Loading your favorites...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Listings
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Heart className="h-8 w-8 text-red-500" />
                My Favorites
              </h1>
              <p className="text-gray-600">
                {isAuthenticated 
                  ? `You have ${count} saved ${count === 1 ? 'listing' : 'listings'}`
                  : `You have ${count} saved ${count === 1 ? 'listing' : 'listings'} (sign in to sync across devices)`
                }
              </p>
            </div>
            
            {count > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearAllFavorites}
                className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {!isAuthenticated ? (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="text-center">
                <LogIn className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sign in to sync favorites</h3>
                <p className="text-gray-600 mb-4">
                  Create an account to save your favorites across all your devices and never lose track of listings you love.
                </p>
                <Link to="/auth">
                  <Button className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In / Create Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {count === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-20 w-20 mx-auto text-gray-300 mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start exploring our listings and save your favorites by clicking the heart icon on any listing card.
            </p>
            <Link to="/">
              <Button className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Browse Listings
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Favorites Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteItems.map((item) => (
                <ListingCard
                  key={item.id}
                  listing={item.listing}
                  onViewDetails={() => handleViewDetails(item)}
                />
              ))}
            </div>

            {/* Help Text */}
            <div className="mt-12 text-center">
              <p className="text-sm text-gray-500">
                💡 Tip: Click the heart icon on any listing to add it to your favorites
              </p>
            </div>
          </>
        )}
      </div>

      {/* Listing Modal */}
      <ListingModal
        listing={selectedListing}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Favorites;
