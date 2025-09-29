import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, MessageCircle, X, Car, Home, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Listing } from "@/data/listings";
import { supabase } from "@/integrations/supabase/client";

interface ListingModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
}

const ListingModal = ({ listing, isOpen, onClose }: ListingModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  if (!listing) return null;

  const images = listing.images || [];
  const hasImages = images.length > 0;
  const hasMultipleImages = images.length > 1;

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Reset image index when listing changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [listing?.id]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen || !hasMultipleImages) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevImage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextImage();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasMultipleImages, prevImage, nextImage]);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price).replace('KES', 'KSH');
  };

  const handleWhatsAppClick = async () => {
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
          {/* Enhanced Image Gallery */}
          <div className="relative h-64 md:h-96 bg-muted rounded-lg overflow-hidden">
            {hasImages ? (
              <>
                {/* Main Image */}
                <div className="relative w-full h-full">
                  <img
                    src={images[currentImageIndex]}
                    alt={`${listing.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  
                  {/* Navigation Arrows */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-all duration-200"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-all duration-200"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {hasMultipleImages && (
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  )}
                </div>

                {/* Image Thumbnails */}
                {hasMultipleImages && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/70 p-2 rounded-lg">
                    {images.slice(0, 6).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`w-12 h-8 rounded border-2 overflow-hidden transition-all ${
                          index === currentImageIndex
                            ? 'border-white scale-110'
                            : 'border-transparent hover:border-white/50'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                    {images.length > 6 && (
                      <div className="w-12 h-8 rounded border-2 border-transparent bg-black/50 flex items-center justify-center text-white text-xs">
                        +{images.length - 6}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              // Fallback when no images
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                {listing.type === 'car' ? (
                  <Car className="h-20 w-20 text-muted-foreground/50" />
                ) : (
                  <Home className="h-20 w-20 text-muted-foreground/50" />
                )}
                <div className="absolute bottom-4 text-muted-foreground text-sm">
                  No images available
                </div>
              </div>
            )}
          </div>

          {/* Quick Image Navigation (Keyboard support) */}
          {hasMultipleImages && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>Use arrow keys to navigate images</span>
              <div className="flex gap-1">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">←</kbd>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">→</kbd>
              </div>
            </div>
          )}

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