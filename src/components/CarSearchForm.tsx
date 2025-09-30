import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, DollarSign, Calendar, Gauge, Car, Filter, X } from 'lucide-react';

interface SearchFilters {
  make: string;
  model: string;
  yearMin: string;
  yearMax: string;
  priceMin: string;
  priceMax: string;
  mileageMax: string;
  bodyType: string;
  fuelType: string;
  transmission: string;
  location: string;
}

const CarSearchForm = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    make: '',
    model: '',
    yearMin: '',
    yearMax: '',
    priceMin: '',
    priceMax: '',
    mileageMax: '',
    bodyType: '',
    fuelType: '',
    transmission: '',
    location: ''
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);

  const carMakes = [
    'Toyota', 'Honda', 'Nissan', 'Mazda', 'Subaru', 'Mitsubishi', 
    'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Ford', 'Chevrolet',
    'Hyundai', 'Kia', 'Peugeot', 'Renault'
  ];

  const bodyTypes = [
    'Sedan', 'SUV', 'Hatchback', 'Station Wagon', 'Pickup', 'Coupe', 
    'Convertible', 'Van', 'Crossover'
  ];

  const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
  const transmissions = ['Manual', 'Automatic', 'CVT'];
  const locations = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Machakos'];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 25 }, (_, i) => currentYear - i);

  const handleSearch = () => {
    console.log('Searching with filters:', filters);
    // Implement search logic
  };

  const clearFilters = () => {
    setFilters({
      make: '',
      model: '',
      yearMin: '',
      yearMax: '',
      priceMin: '',
      priceMax: '',
      mileageMax: '',
      bodyType: '',
      fuelType: '',
      transmission: '',
      location: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mx-4 -mt-10 relative z-20 border">
      {/* Quick Search Bar - Similar to Cars.com */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Make */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Make</label>
            <Select value={filters.make} onValueChange={(value) => setFilters({...filters, make: value})}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Any Make" />
              </SelectTrigger>
              <SelectContent>
                {carMakes.map(make => (
                  <SelectItem key={make} value={make}>{make}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Model</label>
            <Select value={filters.model} onValueChange={(value) => setFilters({...filters, model: value})}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Any Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Model</SelectItem>
                {/* Add model options based on selected make */}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Max Price</label>
            <Select value={filters.priceMax} onValueChange={(value) => setFilters({...filters, priceMax: value})}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Any Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1000000">KSH 1M</SelectItem>
                <SelectItem value="2000000">KSH 2M</SelectItem>
                <SelectItem value="3000000">KSH 3M</SelectItem>
                <SelectItem value="4000000">KSH 4M</SelectItem>
                <SelectItem value="5000000">KSH 5M+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Location</label>
            <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="All Kenya" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <Button 
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 h-12 text-lg font-semibold rounded-lg"
          >
            <Search className="h-5 w-5 mr-2" />
            Search Cars
          </Button>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between border-t pt-4">
        <Button
          variant="ghost"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          <Filter className="h-4 w-4 mr-2" />
          {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
        </Button>

        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {Object.values(filters).filter(v => v).length} filters
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="border-t mt-4 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Refine Your Search</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Year Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Year Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Select value={filters.yearMin} onValueChange={(value) => setFilters({...filters, yearMin: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Min Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filters.yearMax} onValueChange={(value) => setFilters({...filters, yearMax: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Max Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Price Range (KSH)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Min Price"
                  value={filters.priceMin}
                  onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                  type="number"
                />
                <Input
                  placeholder="Max Price"
                  value={filters.priceMax}
                  onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                  type="number"
                />
              </div>
            </div>

            {/* Mileage */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Gauge className="h-4 w-4 mr-2" />
                Max Mileage (KM)
              </label>
              <Select value={filters.mileageMax} onValueChange={(value) => setFilters({...filters, mileageMax: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Mileage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50000">Under 50,000</SelectItem>
                  <SelectItem value="100000">Under 100,000</SelectItem>
                  <SelectItem value="150000">Under 150,000</SelectItem>
                  <SelectItem value="200000">Under 200,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Body Type */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Car className="h-4 w-4 mr-2" />
                Body Type
              </label>
              <Select value={filters.bodyType} onValueChange={(value) => setFilters({...filters, bodyType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Body Type" />
                </SelectTrigger>
                <SelectContent>
                  {bodyTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fuel Type */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Fuel Type</label>
              <Select value={filters.fuelType} onValueChange={(value) => setFilters({...filters, fuelType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Fuel Type" />
                </SelectTrigger>
                <SelectContent>
                  {fuelTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Transmission */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Transmission</label>
              <Select value={filters.transmission} onValueChange={(value) => setFilters({...filters, transmission: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Transmission" />
                </SelectTrigger>
                <SelectContent>
                  {transmissions.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Search Button */}
          <div className="flex justify-center mt-6">
            <Button 
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-lg font-semibold rounded-lg"
            >
              <Search className="h-5 w-5 mr-2" />
              Search with Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarSearchForm;