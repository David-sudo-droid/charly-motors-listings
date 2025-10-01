import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Car, Home, MessageCircle, Star, Eye, Share2, Scale, Phone, Gauge, Calendar, Fuel, Heart } from "lucide-react";
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

  // Add car-specific helper functions
  const getCarBadges = () => {
    const badges = [];
    const specs = listing.specifications || {};
    
    if (listing.featured) badges.push({ text: 'Featured', color: 'bg-orange-500', icon: '⭐' });
    if (specs.mileage && parseInt(specs.mileage.replace(/[^0-9]/g, '')) < 50000) {
      badges.push({ text: 'Low Miles', color: 'bg-green-500' });
    }
    if (listing.price < 2000000) badges.push({ text: 'Great Deal', color: 'bg-blue-500' });
    
    return badges;
  };

  const getKeySpecs = () => {
    const specs = listing.specifications || {};
    return [
      { icon: Calendar, label: specs.Year || specs.year || 'N/A', title: 'Year' },
      { icon: Gauge, label: specs.Mileage || specs.mileage || 'N/A', title: 'Mileage' },
      { icon: Fuel, label: specs['Fuel Type'] || specs.fuelType || 'N/A', title: 'Fuel' },
      { icon: Car, label: specs.Transmission || specs.transmission || 'N/A', title: 'Trans.' }
    ];
  };

  return (
    <Card 
      className="listing-card group relative overflow-hidden bg-white border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all duration-300 rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Car site style badges - Mobile optimized */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 flex flex-wrap gap-1">
        {getCarBadges().map((badge, index) => (
          <Badge key={index} className={`${badge.color} text-white text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1`}>
            {badge.icon && <span className="mr-0.5 sm:mr-1">{badge.icon}</span>}
            <span className="text-xs">{badge.text}</span>
          </Badge>
        ))}
      </div>

      {/* Car site style action buttons - Mobile always visible */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={handleCompareClick}
          className={`w-7 h-7 sm:w-8 sm:h-8 bg-white border border-gray-300 rounded-md flex items-center justify-center transition-colors duration-200 hover:bg-blue-50 ${isInComparison(listing.id) ? 'bg-blue-50 border-blue-300 text-blue-600' : 'text-gray-600'}`}
          title="Compare"
        >
          <Scale className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={handleShareClick}
          className="w-7 h-7 sm:w-8 sm:h-8 bg-white border border-gray-300 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors duration-200"
          title="Save"
        >
          <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
      
      {/* Professional image section like car sites - Mobile responsive */}
      <div className="relative h-40 sm:h-44 lg:h-48 bg-gray-100 overflow-hidden cursor-pointer" onClick={handleViewDetails}>
        
        {listing.images && listing.images.length > 0 ? (
          <OptimizedImage
            src={listing.images[0]}
            alt={`${listing.title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            width={400}
            height={192}
            listingType={listing.type}
            priority={listing.featured}
            quality={85}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            {listing.type === 'car' ? (
              <Car className="h-16 w-16 text-gray-400" />
            ) : (
              <Home className="h-16 w-16 text-gray-400" />
            )}
          </div>
        )}
        
        {/* Image count indicator - Mobile optimized */}
        {listing.images && listing.images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
            1 of {listing.images.length}
          </div>
        )}
      </div>

      {/* Professional content section like AutoTrader - Mobile optimized */}
      <CardContent className="p-3 sm:p-4" onClick={handleViewDetails}>
        {/* Price prominently displayed */}
        <div className="mb-2 sm:mb-3">
          <div className="text-xl sm:text-2xl font-bold text-gray-900">
            {formatPrice(listing.price, listing.currency)}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors leading-tight">
          {listing.title}
        </h3>

        {/* Key specifications grid - Mobile responsive */}
        <div className="grid grid-cols-2 gap-1 sm:gap-2 mb-2 sm:mb-3">
          {getKeySpecs().slice(0, 4).map((spec, index) => {
            const IconComponent = spec.icon;
            return (
              <div key={index} className="flex items-center text-xs sm:text-sm text-gray-600">
                <IconComponent className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-gray-400" />
                <span className="truncate" title={`${spec.title}: ${spec.label}`}>
                  {spec.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Location */}
        <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-gray-400" />
          <span className="truncate">{listing.location}</span>
        </div>

        {/* Dealer info */}
        <div className="text-xs text-gray-500 border-t pt-1.5 sm:pt-2">
          Charly Motors • Verified Dealer
        </div>
      </CardContent>

      {/* Professional footer like car sites - Mobile optimized */}
      <CardFooter className="p-3 sm:p-4 pt-0 flex gap-2 border-t">
        <Button 
          variant="outline"
          size="sm"
          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-xs sm:text-sm py-1.5 sm:py-2"
          onClick={handleViewDetails}
        >
          <span className="hidden sm:inline">View Details</span>
          <span className="sm:hidden">View</span>
        </Button>
        <Button 
          size="sm"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-colors text-xs sm:text-sm py-1.5 sm:py-2"
          onClick={handleWhatsAppClick}
        >
          <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          Contact
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;