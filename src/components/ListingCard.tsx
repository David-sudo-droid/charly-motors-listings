import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Car, Home, MessageCircle, Star, Eye, Heart, Share2, Scale } from "lucide-react";
import { Listing } from "@/data/listings";
import { useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useComparison } from "@/hooks/useComparison";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface ListingCardProps {
  listing: Listing;
  onViewDetails: (listing: Listing) => void;
}

const ListingCard = ({ listing, onViewDetails }: ListingCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites(user?.id);
  const { addToComparison, isInComparison } = useComparison();

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price).replace('KES', 'KSH');
  };

  const handleWhatsAppClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Track inquiry analytics
    try {
      await supabase.rpc('increment_inquiry_count', { listing_uuid: listing.id });
    } catch (error) {
      console.error('Error tracking inquiry:', error);
    }
    
    const message = `Hi! I'm interested in the ${listing.title} listed for ${formatPrice(listing.price, listing.currency)}. Could you provide more information?`;
    const whatsappUrl = `https://wa.me/${listing.whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(listing.id);
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: `Check out this ${listing.type}: ${listing.title} for ${formatPrice(listing.price, listing.currency)}`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
  };

  const handleViewDetails = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Track view analytics
    try {
      await supabase.rpc('increment_view_count', { listing_uuid: listing.id });
    } catch (error) {
      console.error('Error tracking view:', error);
    }
    
    onViewDetails(listing);
  };

  const handleCompareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Adding to comparison:', listing.title);
    const success = addToComparison(listing);
    console.log('Add to comparison result:', success);
  };

  return (
    <Card 
      className="listing-card cursor-pointer group relative overflow-hidden bg-white border-border shadow-md hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Clean badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {listing.featured && (
          <Badge className="bg-primary text-primary-foreground font-semibold">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
          {listing.type === 'car' ? (
            <>
              <Car className="w-3 h-3 mr-1" />
              Vehicle
            </>
          ) : (
            <>
              <Home className="w-3 h-3 mr-1" />
              Property
            </>
          )}
        </Badge>
      </div>

      {/* Action buttons */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleFavoriteClick}
          className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white border border-border/20"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${isFavorite(listing.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'}`} 
          />
        </button>
        <button
          onClick={handleCompareClick}
          className={`w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white border border-border/20 ${isInComparison(listing.id) ? 'bg-primary/10 border-primary/20' : ''}`}
        >
          <Scale className={`w-4 h-4 transition-colors ${isInComparison(listing.id) ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`} />
        </button>
        <button
          onClick={handleShareClick}
          className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white border border-border/20"
        >
          <Share2 className="w-4 h-4 text-muted-foreground hover:text-primary" />
        </button>
      </div>
      
      {/* Enhanced image section with carousel */}
      <div className="relative h-56 bg-slate-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none" />
        
        {listing.images && listing.images.length > 0 ? (
          <Carousel className="w-full h-full">
            <CarouselContent className="h-56">
              {listing.images.map((image, index) => (
                <CarouselItem key={index} className="h-56">
                  <div className="relative w-full h-full" onClick={handleViewDetails}>
                    <img
                      src={image}
                      alt={`${listing.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling!.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      {listing.type === 'car' ? (
                        <Car className="h-16 w-16 text-primary/70" />
                      ) : (
                        <Home className="h-16 w-16 text-primary/70" />
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {listing.images.length > 1 && (
              <>
                <CarouselPrevious className="left-2 h-8 w-8 bg-white/90 hover:bg-white" onClick={(e) => e.stopPropagation()} />
                <CarouselNext className="right-2 h-8 w-8 bg-white/90 hover:bg-white" onClick={(e) => e.stopPropagation()} />
              </>
            )}
          </Carousel>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center" onClick={handleViewDetails}>
            {listing.type === 'car' ? (
              <Car className="h-16 w-16 text-primary/70" />
            ) : (
              <Home className="h-16 w-16 text-primary/70" />
            )}
          </div>
        )}

        {/* Hover overlay with view button */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 z-20 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-white/90 backdrop-blur-sm text-primary hover:bg-white pointer-events-auto"
            onClick={handleViewDetails}
          >
            <Eye className="w-4 h-4 mr-2" />
            Quick View
          </Button>
        </div>
      </div>

      {/* Enhanced content section */}
      <CardContent className="p-6" onClick={handleViewDetails}>
        <div className="mb-4">
          <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors duration-300 mb-2">
            {listing.title}
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {formatPrice(listing.price, listing.currency)}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {listing.location}
            </div>
          </div>
        </div>

        {/* Features with better styling */}
        {listing.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {listing.features.slice(0, 3).map((feature, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors"
              >
                {feature}
              </Badge>
            ))}
            {listing.features.length > 3 && (
              <Badge variant="outline" className="text-xs bg-muted/50">
                +{listing.features.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {listing.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        )}
      </CardContent>

      {/* Enhanced footer */}
      <CardFooter className="px-6 pb-6 pt-0 flex gap-3">
        <Button 
          variant="outline" 
          className="flex-1 hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all duration-300"
          onClick={handleViewDetails}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
        <Button 
          className="flex-1 bg-green-600 hover:bg-green-700 text-white transition-all duration-300 shadow-lg hover:shadow-green-600/25"
          onClick={handleWhatsAppClick}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;