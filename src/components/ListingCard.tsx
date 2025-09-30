import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Car, Home, MessageCircle, Star, Eye, Share2, Scale } from "lucide-react";
import { Listing } from "@/data/listings";
import { useState } from "react";
import { useComparison } from "@/hooks/useComparison";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import OptimizedImage from "@/components/OptimizedImage";

interface ListingCardProps {
  listing: Listing;
  onViewDetails: (listing: Listing) => void;
}

const ListingCard = ({ listing, onViewDetails }: ListingCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToComparison, isInComparison } = useComparison();

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price).replace('KES', 'KSH');
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const message = `Hi! I'm interested in the ${listing.title} listed for ${formatPrice(listing.price, listing.currency)}. Could you provide more information?`;
    const whatsappUrl = `https://wa.me/${listing.whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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

  const handleViewDetails = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onViewDetails(listing);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToComparison({
      ...listing,
      specifications: listing.specifications || {}
    });
  };

  return (
    <Card 
      className="listing-card cursor-pointer group relative overflow-hidden bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2 animate-scale-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Modern gradient badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {listing.featured && (
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold shadow-lg animate-bounce-subtle">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Featured
          </Badge>
        )}
        <Badge className="bg-white/95 backdrop-blur-md border border-white/30 text-gray-700 shadow-lg">
          {listing.type === 'car' ? (
            <>
              <Car className="w-3 h-3 mr-1 text-blue-600" />
              Vehicle
            </>
          ) : (
            <>
              <Home className="w-3 h-3 mr-1 text-green-600" />
              Property
            </>
          )}
        </Badge>
      </div>

      {/* Modern action buttons */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
        <button
          onClick={handleCompareClick}
          className={`w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl border border-white/30 ${isInComparison(listing.id) ? 'bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30 shadow-primary/20' : 'hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10'}`}
        >
          <Scale className={`w-4 h-4 transition-all duration-300 ${isInComparison(listing.id) ? 'text-primary scale-110' : 'text-gray-600 hover:text-primary'}`} />
        </button>
        <button
          onClick={handleShareClick}
          className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl border border-white/30 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
        >
          <Share2 className="w-4 h-4 text-gray-600 hover:text-blue-600 transition-colors duration-300" />
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
                  <div className="relative w-full h-full cursor-pointer" onClick={handleViewDetails}>
                    <OptimizedImage
                      src={image}
                      alt={`${listing.title} - Image ${index + 1}`}
                      className="transition-transform duration-700 group-hover:scale-110"
                      width={400}
                      height={224}
                      listingType={listing.type}
                      priority={listing.featured && index === 0} // Prioritize first image of featured listings
                      quality={85}
                    />
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

      {/* Modern glass morphism footer */}
      <CardFooter className="px-6 pb-6 pt-0 flex gap-3 bg-gradient-to-r from-white/40 to-white/20 backdrop-blur-sm">
        <Button 
          variant="outline" 
          className="flex-1 bg-white/80 backdrop-blur-sm border-white/30 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:border-primary/30 hover:text-primary transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
          onClick={handleViewDetails}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
        <Button 
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all duration-300 shadow-lg hover:shadow-green-500/30 hover:scale-105 border-0"
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