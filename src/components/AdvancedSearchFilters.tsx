import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, X, Search, MapPin, DollarSign, Calendar, Settings } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface AdvancedFilters {
  searchQuery: string;
  type: 'all' | 'car' | 'property';
  location: string;
  priceMin: number;
  priceMax: number;
  yearMin?: number;
  yearMax?: number;
  condition: string[];
  transmission: string[];
  fuelType: string[];
  propertyType: string[];
  bedrooms: string;
  features: string[];
}

interface AdvancedSearchFiltersProps {
  filters: AdvancedFilters;
  onFiltersChange: (filters: AdvancedFilters) => void;
  onSearch: () => void;
  onReset: () => void;
}

const AdvancedSearchFilters = ({ 
  filters, 
  onFiltersChange, 
  onSearch, 
  onReset 
}: AdvancedSearchFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof AdvancedFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: keyof AdvancedFilters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const conditionOptions = [
    { value: 'new', label: 'New' },
    { value: 'used-excellent', label: 'Used - Excellent' },
    { value: 'used-good', label: 'Used - Good' },
    { value: 'used-fair', label: 'Used - Fair' }
  ];

  const transmissionOptions = [
    { value: 'automatic', label: 'Automatic' },
    { value: 'manual', label: 'Manual' },
    { value: 'cvt', label: 'CVT' },
    { value: 'semi-automatic', label: 'Semi-Automatic' }
  ];

  const fuelOptions = [
    { value: 'petrol', label: 'Petrol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'electric', label: 'Electric' }
  ];

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'land', label: 'Land' },
    { value: 'commercial', label: 'Commercial' }
  ];

  const popularFeatures = [
    'Air Conditioning', 'Parking', 'Security', 'Swimming Pool', 
    'Garden', 'Balcony', 'Furnished', 'Pet Friendly',
    'Bluetooth', 'Backup Camera', 'Navigation', 'Sunroof'
  ];

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.location) count++;
    if (filters.priceMin > 0 || filters.priceMax < 50000000) count++;
    if (filters.condition.length > 0) count++;
    if (filters.transmission.length > 0) count++;
    if (filters.fuelType.length > 0) count++;
    if (filters.propertyType.length > 0) count++;
    if (filters.bedrooms) count++;
    if (filters.features.length > 0) count++;
    return count;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Search
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()} filters
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Basic Search */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by title, brand, model..."
                className="pl-10"
                value={filters.searchQuery}
                onChange={(e) => updateFilter('searchQuery', e.target.value)}
              />
            </div>
          </div>

          <div className="w-48">
            <Label>Type</Label>
            <Select 
              value={filters.type} 
              onValueChange={(value: 'all' | 'car' | 'property') => updateFilter('type', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="car">Cars</SelectItem>
                <SelectItem value="property">Properties</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location and Price */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Enter city, area..."
                className="pl-10"
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
              />
            </div>
          </div>

          <div className="w-64">
            <Label className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              Price Range (KSH)
            </Label>
            <div className="px-2 py-4">
              <Slider
                min={0}
                max={50000000}
                step={100000}
                value={[filters.priceMin, filters.priceMax]}
                onValueChange={([min, max]) => {
                  updateFilter('priceMin', min);
                  updateFilter('priceMax', max);
                }}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>{filters.priceMin.toLocaleString()}</span>
                <span>{filters.priceMax.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Advanced Filters */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="space-y-6">
            {/* Car-specific filters */}
            {filters.type === 'car' || filters.type === 'all' ? (
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium text-primary">Vehicle Filters</h3>
                
                {/* Year Range */}
                <div>
                  <Label className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Year Range
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="number"
                      placeholder="From"
                      min="1990"
                      max={new Date().getFullYear()}
                      value={filters.yearMin || ''}
                      onChange={(e) => updateFilter('yearMin', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-24"
                    />
                    <span className="self-center">to</span>
                    <Input
                      type="number"
                      placeholder="To"
                      min="1990"
                      max={new Date().getFullYear()}
                      value={filters.yearMax || ''}
                      onChange={(e) => updateFilter('yearMax', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-24"
                    />
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <Label>Condition</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {conditionOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`condition-${option.value}`}
                          checked={filters.condition.includes(option.value)}
                          onCheckedChange={() => toggleArrayFilter('condition', option.value)}
                        />
                        <Label 
                          htmlFor={`condition-${option.value}`}
                          className="text-sm cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transmission & Fuel Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Transmission</Label>
                    <div className="space-y-2 mt-2">
                      {transmissionOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`transmission-${option.value}`}
                            checked={filters.transmission.includes(option.value)}
                            onCheckedChange={() => toggleArrayFilter('transmission', option.value)}
                          />
                          <Label 
                            htmlFor={`transmission-${option.value}`}
                            className="text-sm cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Fuel Type</Label>
                    <div className="space-y-2 mt-2">
                      {fuelOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`fuel-${option.value}`}
                            checked={filters.fuelType.includes(option.value)}
                            onCheckedChange={() => toggleArrayFilter('fuelType', option.value)}
                          />
                          <Label 
                            htmlFor={`fuel-${option.value}`}
                            className="text-sm cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Property-specific filters */}
            {filters.type === 'property' || filters.type === 'all' ? (
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium text-primary">Property Filters</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Property Type</Label>
                    <div className="space-y-2 mt-2">
                      {propertyTypes.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`property-${option.value}`}
                            checked={filters.propertyType.includes(option.value)}
                            onCheckedChange={() => toggleArrayFilter('propertyType', option.value)}
                          />
                          <Label 
                            htmlFor={`property-${option.value}`}
                            className="text-sm cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Bedrooms</Label>
                    <Select value={filters.bedrooms} onValueChange={(value) => updateFilter('bedrooms', value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any</SelectItem>
                        <SelectItem value="1">1 Bedroom</SelectItem>
                        <SelectItem value="2">2 Bedrooms</SelectItem>
                        <SelectItem value="3">3 Bedrooms</SelectItem>
                        <SelectItem value="4">4 Bedrooms</SelectItem>
                        <SelectItem value="5+">5+ Bedrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Features */}
            <div className="border-t pt-4">
              <Label>Features</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {popularFeatures.map((feature) => (
                  <Badge
                    key={feature}
                    variant={filters.features.includes(feature) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleArrayFilter('features', feature)}
                  >
                    {feature}
                    {filters.features.includes(feature) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={onSearch} className="flex-1">
            <Search className="h-4 w-4 mr-2" />
            Search ({getActiveFiltersCount()} filters)
          </Button>
          {getActiveFiltersCount() > 0 && (
            <Button variant="outline" onClick={onReset}>
              <X className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedSearchFilters;
