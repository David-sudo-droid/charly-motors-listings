import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Car, Home, MessageCircle } from "lucide-react";
import { Listing } from "@/data/listings";

interface ListingCardProps {
  listing: Listing;
  onViewDetails: (listing: Listing) => void;
}

const ListingCard = ({ listing, onViewDetails }: ListingCardProps) => {
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

  return (
    <Card className="listing-card cursor-pointer group relative overflow-hidden">
      {listing.featured && (
        <Badge className="absolute top-4 left-4 z-10 bg-accent text-accent-foreground">
          Featured
        </Badge>
      )}
      
      <div 
        className="relative h-48 bg-muted overflow-hidden"
        onClick={() => onViewDetails(listing)}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
        {listing.images && listing.images.length > 0 ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            {listing.type === 'car' ? (
              <Car className="h-16 w-16 text-muted-foreground" />
            ) : (
              <Home className="h-16 w-16 text-muted-foreground" />
            )}
          </div>
        )}
      </div>

      <CardContent className="p-4" onClick={() => onViewDetails(listing)}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-smooth">
            {listing.title}
          </h3>
          <div className="text-right">
            <div className="text-xl font-bold text-accent">
              {formatPrice(listing.price, listing.currency)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          {listing.location}
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {listing.features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
          {listing.features.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{listing.features.length - 3} more
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {listing.description}
        </p>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0 flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => onViewDetails(listing)}
        >
          View Details
        </Button>
        <Button 
          variant="default"
          className="whatsapp-btn flex-1"
          onClick={handleWhatsAppClick}
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;