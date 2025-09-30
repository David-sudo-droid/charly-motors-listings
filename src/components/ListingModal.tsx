import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, MessageCircle, X, Car, Home } from "lucide-react";
import { Listing } from "@/data/listings";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import OptimizedImage from "@/components/OptimizedImage";

interface ListingModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
}

const ListingModal = ({ listing, isOpen, onClose }: ListingModalProps) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-md border border-white/30 shadow-2xl rounded-3xl p-0">
        <DialogHeader className="p-8 pb-0">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="flex-1">
              <DialogTitle className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight">
                {listing.title}
              </DialogTitle>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                <span className="text-lg">{listing.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                {formatPrice(listing.price, listing.currency)}
              </div>
              {listing.featured && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg px-4 py-2 animate-bounce-subtle">
                  ⭐ Featured Premium
                </Badge>
              )}
            </div>
          </div>
          <div className="mt-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </DialogHeader>

        <div className="p-8 pt-4 space-y-8">
          {/* Modern Image Carousel */}
          <div className="relative">
            {listing.images && listing.images.length > 0 ? (
              <Carousel className="w-full rounded-2xl overflow-hidden shadow-2xl">
                <CarouselContent>
                  {listing.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative h-72 md:h-[28rem] lg:h-[32rem] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                        <OptimizedImage
                          src={image}
                          alt={`${listing.title} - Image ${index + 1}`}
                          className=""
                          width={1200}
                          height={512}
                          listingType={listing.type}
                          priority={index === 0} // Prioritize first image
                          quality={95} // Highest quality for modal
                        />
                        {/* Image overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {listing.images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-6 h-12 w-12 bg-white/90 backdrop-blur-md hover:bg-white shadow-lg border border-white/30" />
                    <CarouselNext className="right-6 h-12 w-12 bg-white/90 backdrop-blur-md hover:bg-white shadow-lg border border-white/30" />
                  </>
                )}
              </Carousel>
            ) : (
              <div className="relative h-64 md:h-96 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                {listing.type === 'car' ? (
                  <Car className="h-20 w-20 text-muted-foreground" />
                ) : (
                  <Home className="h-20 w-20 text-muted-foreground" />
                )}
              </div>
            )}
          </div>

          {/* Modern Description */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Description</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              {listing.description}
            </p>
          </div>

          {/* Modern Features */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Features & Amenities</h3>
            <div className="flex flex-wrap gap-3">
              {listing.features.map((feature, index) => (
                <Badge 
                  key={index} 
                  className="bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20 px-4 py-2 text-sm font-medium hover:from-primary/20 hover:to-accent/20 transition-all duration-300"
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

          {/* Modern Contact Section */}
          <div className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-2xl p-8 border border-green-200/30 shadow-lg">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Interested in this {listing.type}?
              </h3>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed max-w-2xl mx-auto">
                Ready to make this yours? Contact us via WhatsApp for instant responses, detailed information, 
                or to schedule a personal viewing at your convenience.
              </p>
              <Button 
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 px-8 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold"
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