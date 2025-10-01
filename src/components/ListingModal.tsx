import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, MessageCircle, X, Car, Home, Heart, Share2 } from "lucide-react";
import { Listing } from "@/data/listings";
import { useFavorites } from "@/hooks/useFavorites";
import OptimizedImage from "@/components/OptimizedImage";

interface ListingModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
}

const ListingModal = ({ listing, isOpen, onClose }: ListingModalProps) => {
  const { toggleFavorite, isFavorited } = useFavorites();
  
  if (!listing) return null;

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price).replace('KES', 'KSH');
  };

  const handleWhatsAppClick = () => {
    const message = `Hi! I'm interested in the ${listing.title} listed for ${formatPrice(listing.price, listing.currency)}. Could you provide more information?`;
    const whatsappUrl = `https://wa.me/${listing.whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFavoriteClick = () => {
    toggleFavorite(listing.id, listing);
  };

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: `Check out this ${listing.type}: ${listing.title} for ${formatPrice(listing.price, listing.currency)}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[95vh] overflow-y-auto bg-white border border-gray-200 shadow-xl rounded-lg p-0 m-4">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <div className="flex flex-col items-start gap-4">
            <DialogTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
              {listing.title}
            </DialogTitle>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-2 text-blue-600" />
              <span className="text-sm sm:text-base">{listing.location}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600">
                {formatPrice(listing.price, listing.currency)}
              </div>
              {listing.featured && (
                <Badge className="bg-yellow-500 text-white shadow-sm px-3 py-1 text-sm w-fit">
                  ⭐ Featured
                </Badge>
              )}
            </div>
          </div>
          <div className="mt-4 h-px bg-gray-200"></div>
        </DialogHeader>

        <div className="p-4 sm:p-6 pt-2 space-y-4 sm:space-y-6">
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={handleFavoriteClick}
              className={`flex items-center gap-2 text-sm ${
                isFavorited(listing.id) 
                  ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorited(listing.id) ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isFavorited(listing.id) ? 'Remove from Favorites' : 'Add to Favorites'}</span>
              <span className="sm:hidden">{isFavorited(listing.id) ? 'Remove' : 'Favorite'}</span>
            </Button>
          </div>

          {/* Main Image */}
          {listing.images && listing.images.length > 0 && (
            <div className="mb-4 sm:mb-6">
              <OptimizedImage
                src={listing.images[0]}
                alt={`${listing.title}`}
                className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-lg"
                width={800}
                height={600}
                priority={true}
                listingType={listing.type}
              />
              {listing.images.length > 1 && (
                <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center">
                  1 of {listing.images.length} photos available
                </p>
              )}
            </div>
          )}

          {/* Description */}
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-900">Description</h3>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {listing.description}
            </p>
          </div>

          {/* Features */}
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-900">Features</h3>
            <div className="flex flex-wrap gap-2">
              {listing.features.map((feature, index) => (
                <Badge 
                  key={index} 
                  className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1 text-xs sm:text-sm"
                >
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          {/* Modern Specifications */}
          {listing.specifications && (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {listing.type === 'car' ? 'Vehicle Specifications' : 'Property Details'}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(listing.specifications).map(([key, value]) => (
                  <div key={key} className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 rounded-xl p-4 border border-gray-200/50">
                    <span className="font-semibold text-primary text-sm uppercase tracking-wide">{key}</span>
                    <div className="text-gray-800 font-medium text-lg mt-1">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Section */}
          <div className="bg-green-50 rounded-lg p-4 sm:p-6 border border-green-200">
            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-green-800">Interested in this {listing.type}?</h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">Contact us to schedule a viewing or get more information.</p>
              <div className="flex items-center justify-center text-green-700 mb-4">
                <MessageCircle className="h-4 w-4 mr-2" />
                <span className="font-medium text-sm sm:text-base">{listing.whatsappNumber}</span>
              </div>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-sm sm:text-base font-medium w-full sm:w-auto"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle className="h-6 w-6 mr-3" />
                💬 Chat with us on WhatsApp
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Usually responds within minutes • Available 24/7
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ListingModal;