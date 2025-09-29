import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  X, 
  Car, 
  Home, 
  MapPin, 
  DollarSign, 
  Calendar, 
  MessageCircle,
  Star,
  Fuel,
  Settings,
  Bed,
  Bath
} from 'lucide-react';
import { ComparisonItem } from '@/hooks/useComparison';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ComparisonItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

const ComparisonModal = ({ isOpen, onClose, items, onRemove, onClear }: ComparisonModalProps) => {
  const [selectedImageIndexes, setSelectedImageIndexes] = useState<{[key: string]: number}>({});

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price).replace('KES', 'KSH');
  };

  const handleWhatsAppClick = (item: ComparisonItem) => {
    const message = `Hi! I'm interested in the ${item.title} listed for ${formatPrice(item.price, item.currency)}. Could you provide more information?`;
    const whatsappUrl = `https://wa.me/${item.whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getComparisonFields = (items: ComparisonItem[]) => {
    if (items.length === 0) return [];
    
    const type = items[0].type;
    
    if (type === 'car') {
      return [
        { key: 'price', label: 'Price', icon: DollarSign },
        { key: 'year', label: 'Year', icon: Calendar, spec: true },
        { key: 'make', label: 'Make', icon: Car, spec: true },
        { key: 'model', label: 'Model', icon: Car, spec: true },
        { key: 'condition', label: 'Condition', icon: Star, spec: true },
        { key: 'transmission', label: 'Transmission', icon: Settings, spec: true },
        { key: 'fuelType', label: 'Fuel Type', icon: Fuel, spec: true },
        { key: 'mileage', label: 'Mileage', icon: Car, spec: true },
        { key: 'location', label: 'Location', icon: MapPin },
      ];
    } else {
      return [
        { key: 'price', label: 'Price', icon: DollarSign },
        { key: 'propertyType', label: 'Property Type', icon: Home, spec: true },
        { key: 'bedrooms', label: 'Bedrooms', icon: Bed, spec: true },
        { key: 'bathrooms', label: 'Bathrooms', icon: Bath, spec: true },
        { key: 'size', label: 'Size', icon: Home, spec: true },
        { key: 'yearBuilt', label: 'Year Built', icon: Calendar, spec: true },
        { key: 'location', label: 'Location', icon: MapPin },
      ];
    }
  };

  const getFieldValue = (item: ComparisonItem, field: any) => {
    if (field.key === 'price') {
      return formatPrice(item.price, item.currency);
    } else if (field.key === 'location') {
      return item.location;
    } else if (field.spec && item.specifications) {
      const value = item.specifications[field.key];
      return value || 'N/A';
    }
    return 'N/A';
  };

  const changeImage = (itemId: string, direction: 'prev' | 'next') => {
    const item = items.find(i => i.id === itemId);
    if (!item || !item.images.length) return;

    const currentIndex = selectedImageIndexes[itemId] || 0;
    let newIndex;

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % item.images.length;
    } else {
      newIndex = currentIndex === 0 ? item.images.length - 1 : currentIndex - 1;
    }

    setSelectedImageIndexes(prev => ({
      ...prev,
      [itemId]: newIndex
    }));
  };

  if (items.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>No Items to Compare</DialogTitle>
            <DialogDescription>
              Add some listings to your comparison list to see them here.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={onClose}>Close</Button>
        </DialogContent>
      </Dialog>
    );
  }

  const comparisonFields = getComparisonFields(items);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">
                Compare {items[0].type === 'car' ? 'Vehicles' : 'Properties'}
              </DialogTitle>
              <DialogDescription>
                Comparing {items.length} {items[0].type === 'car' ? 'vehicles' : 'properties'} side by side
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClear} size="sm">
                Clear All
              </Button>
              <Button variant="ghost" onClick={onClose} size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[75vh]">
          <div className="space-y-6">
            {/* Images Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => {
                const currentImageIndex = selectedImageIndexes[item.id] || 0;
                const currentImage = item.images[currentImageIndex];
                
                return (
                  <Card key={item.id} className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm"
                      onClick={() => onRemove(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    <div className="relative h-48 bg-muted rounded-t-lg overflow-hidden">
                      {currentImage ? (
                        <>
                          <img
                            src={currentImage}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          {item.images.length > 1 && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                                onClick={() => changeImage(item.id, 'prev')}
                              >
                                ←
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                                onClick={() => changeImage(item.id, 'next')}
                              >
                                →
                              </Button>
                              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                {currentImageIndex + 1} / {item.images.length}
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {item.type === 'car' ? (
                            <Car className="h-12 w-12 text-muted-foreground" />
                          ) : (
                            <Home className="h-12 w-12 text-muted-foreground" />
                          )}
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                      <div className="space-y-2">
                        {item.featured && (
                          <Badge className="mb-2">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        <p className="text-2xl font-bold text-primary">
                          {formatPrice(item.price, item.currency)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Comparison</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium">Feature</th>
                        {items.map((item, index) => (
                          <th key={item.id} className="text-left p-4 font-medium">
                            Item {index + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonFields.map((field, fieldIndex) => (
                        <tr key={field.key} className={fieldIndex % 2 === 0 ? 'bg-muted/30' : ''}>
                          <td className="p-4 font-medium flex items-center gap-2">
                            <field.icon className="h-4 w-4 text-muted-foreground" />
                            {field.label}
                          </td>
                          {items.map((item) => (
                            <td key={item.id} className="p-4">
                              {getFieldValue(item, field)}
                            </td>
                          ))}
                        </tr>
                      ))}
                      
                      {/* Features Row */}
                      <tr>
                        <td className="p-4 font-medium">Features</td>
                        {items.map((item) => (
                          <td key={item.id} className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {item.features.slice(0, 3).map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                              {item.features.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{item.features.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 line-clamp-1">{item.title}</h4>
                    <div className="space-y-2">
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handleWhatsAppClick(item)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact Seller
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ComparisonModal;
