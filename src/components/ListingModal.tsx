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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold mb-2">
                {listing.title}
              </DialogTitle>
              <div className="flex items-center text-muted-foreground mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                {listing.location}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-accent mb-1">
                {formatPrice(listing.price, listing.currency)}
              </div>
              {listing.featured && (
                <Badge className="bg-accent text-accent-foreground">
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Carousel */}
          <div className="relative">
            {listing.images && listing.images.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {listing.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
                        <OptimizedImage
                          src={image}
                          alt={`${listing.title} - Image ${index + 1}`}
                          className="rounded-lg"
                          width={800}
                          height={384}
                          listingType={listing.type}
                          priority={index === 0} // Prioritize first image
                          quality={90} // Higher quality for modal
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {listing.images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
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

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {listing.description}
            </p>
          </div>

          <Separator />

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Features</h3>
            <div className="flex flex-wrap gap-2">
              {listing.features.map((feature, index) => (
                <Badge key={index} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Specifications */}
          {listing.specifications && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {listing.type === 'car' ? 'Vehicle Specifications' : 'Property Details'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(listing.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-border/50">
                      <span className="font-medium">{key}:</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Contact Section */}
          <div className="bg-muted/50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Interested in this {listing.type}?</h3>
            <p className="text-muted-foreground mb-4">
              Contact us via WhatsApp for more information or to schedule a viewing.
            </p>
            <Button 
              variant="default"
              size="lg"
              className="whatsapp-btn w-full md:w-auto"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Contact via WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ListingModal;