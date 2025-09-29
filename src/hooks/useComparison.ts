import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ComparisonItem {
  id: string;
  type: 'car' | 'property';
  title: string;
  price: number;
  currency: string;
  location: string;
  images: string[];
  description: string | null;
  features: string[];
  specifications: any;
  whatsappNumber: string;
  featured: boolean;
}

const COMPARISON_STORAGE_KEY = 'comparison_listings';
const MAX_COMPARISON_ITEMS = 3;

export const useComparison = () => {
  const [comparisonItems, setComparisonItems] = useState<ComparisonItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Load comparison items from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(COMPARISON_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setComparisonItems(parsed);
      } catch (error) {
        console.error('Error parsing stored comparison items:', error);
        localStorage.removeItem(COMPARISON_STORAGE_KEY);
      }
    }
  }, []);

  // Save comparison items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(comparisonItems));
  }, [comparisonItems]);

  const addToComparison = (item: ComparisonItem) => {
    // Check if item is already in comparison
    if (comparisonItems.some(existing => existing.id === item.id)) {
      toast({
        title: "Already in comparison",
        description: "This listing is already in your comparison list",
      });
      return false;
    }

    // Check if we've reached the maximum
    if (comparisonItems.length >= MAX_COMPARISON_ITEMS) {
      toast({
        title: "Comparison limit reached",
        description: `You can only compare up to ${MAX_COMPARISON_ITEMS} items at once`,
        variant: "destructive",
      });
      return false;
    }

    // Check if it's the same type as existing items (optional - you can remove this if you want to allow cross-type comparison)
    if (comparisonItems.length > 0 && comparisonItems[0].type !== item.type) {
      toast({
        title: "Type mismatch",
        description: "You can only compare items of the same type (cars with cars, properties with properties)",
        variant: "destructive",
      });
      return false;
    }

    setComparisonItems(prev => [...prev, item]);
    toast({
      title: "Added to comparison",
      description: `${item.title} has been added to your comparison list`,
    });
    return true;
  };

  const removeFromComparison = (itemId: string) => {
    setComparisonItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Removed from comparison",
      description: "Item removed from comparison list",
    });
  };

  const clearComparison = () => {
    setComparisonItems([]);
    toast({
      title: "Comparison cleared",
      description: "All items removed from comparison",
    });
  };

  const isInComparison = (itemId: string) => {
    return comparisonItems.some(item => item.id === itemId);
  };

  const openComparison = () => {
    if (comparisonItems.length === 0) {
      toast({
        title: "No items to compare",
        description: "Add some listings to comparison first",
        variant: "destructive",
      });
      return;
    }
    setIsOpen(true);
  };

  const closeComparison = () => {
    setIsOpen(false);
  };

  return {
    comparisonItems,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    isOpen,
    openComparison,
    closeComparison,
    maxItems: MAX_COMPARISON_ITEMS,
    count: comparisonItems.length,
    canAdd: comparisonItems.length < MAX_COMPARISON_ITEMS,
  };
};
