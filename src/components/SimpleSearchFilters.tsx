import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';

export interface SimpleFilters {
  searchQuery: string;
  type: 'all' | 'car' | 'property';
  location: string;
  priceMin: number;
  priceMax: number;
}

interface SimpleSearchFiltersProps {
  filters: SimpleFilters;
  onFiltersChange: (filters: SimpleFilters) => void;
  onSearch: () => void;
  onReset: () => void;
}

const SimpleSearchFilters: React.FC<SimpleSearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  onReset,
}) => {
  const handleInputChange = (key: keyof SimpleFilters, value: string | number) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Search Filters</h3>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Query */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search vehicles, properties..."
              value={filters.searchQuery}
              onChange={(e) => handleInputChange('searchQuery', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <Select
            value={filters.type}
            onValueChange={(value: 'all' | 'car' | 'property') => handleInputChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="car">Cars</SelectItem>
              <SelectItem value="property">Properties</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <Input
            type="text"
            placeholder="Enter location..."
            value={filters.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Price (KSH)
          </label>
          <Select
            value={filters.priceMax.toString()}
            onValueChange={(value) => handleInputChange('priceMax', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Max price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1000000">1M KSH</SelectItem>
              <SelectItem value="2000000">2M KSH</SelectItem>
              <SelectItem value="5000000">5M KSH</SelectItem>
              <SelectItem value="10000000">10M KSH</SelectItem>
              <SelectItem value="20000000">20M KSH</SelectItem>
              <SelectItem value="50000000">50M KSH+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={onSearch} className="flex-1">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default SimpleSearchFilters;
