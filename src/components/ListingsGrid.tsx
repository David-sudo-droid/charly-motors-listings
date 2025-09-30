import React, { useState, useMemo, useCallback } from "react";
import ListingCard from "./ListingCard";
import ListingModal from "./ListingModal";
import AdvancedSearchFilters, { AdvancedFilters } from "./AdvancedSearchFilters";
import { useListings, type Listing } from "@/hooks/useListings";
import { usePerformanceMonitoring, useQueryPerformanceMonitoring } from "@/hooks/usePerformanceMonitoring";
import { Loader2, Search, Car, Home, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Custom hook for debounced search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const ListingsGrid = () => {
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = useListings();
  
  // Performance monitoring
  usePerformanceMonitoring('ListingsGrid');
  useQueryPerformanceMonitoring(['listings'], data, isLoading);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<AdvancedFilters>({
    searchQuery: '',
    type: 'all',
    location: '',
    priceMin: 0,
    priceMax: 50000000,
    yearMin: undefined,
    yearMax: undefined,
    condition: [],
    transmission: [],
    fuelType: [],
    propertyType: [],
    bedrooms: '',
    features: []
  });

  // Debounce search query for better performance
  const debouncedSearchQuery = useDebounce(filters.searchQuery, 300);
  
  // Flatten all listings from pages
  const allListings = useMemo(() => {
    return data?.pages.flatMap(page => page.listings) || [];
  }, [data]);

  const handleViewDetails = (listing: Listing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedListing(null);
  };

  // Optimize filtering with better performance and debounced search
  const filteredListings = useMemo(() => {
    if (!allListings.length) return [];
    
    return allListings.filter((listing) => {
      // Type filter - early return for better performance
      if (filters.type !== 'all' && listing.type !== filters.type) {
        return false;
      }
      
      // Search query (debounced)
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        const matchesSearch = 
          listing.title.toLowerCase().includes(query) ||
          listing.location.toLowerCase().includes(query) ||
          listing.description?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      
      // Location filter
      if (filters.location && !listing.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      
      // Price filter
      if (listing.price < filters.priceMin || listing.price > filters.priceMax) {
        return false;
      }
      
      // Year filter (for cars) - optimized
      if (filters.yearMin || filters.yearMax) {
        const year = listing.specifications?.year;
        if (year) {
          if (filters.yearMin && year < filters.yearMin) return false;
          if (filters.yearMax && year > filters.yearMax) return false;
        }
      }
      
      // Array filters - optimized with early returns
      if (filters.condition.length > 0 && 
          (!listing.specifications?.condition || !filters.condition.includes(listing.specifications.condition))) {
        return false;
      }
      
      if (filters.transmission.length > 0 && 
          (!listing.specifications?.transmission || !filters.transmission.includes(listing.specifications.transmission))) {
        return false;
      }
      
      if (filters.fuelType.length > 0 && 
          (!listing.specifications?.fuelType || !filters.fuelType.includes(listing.specifications.fuelType))) {
        return false;
      }
      
      if (filters.propertyType.length > 0 && 
          (!listing.specifications?.propertyType || !filters.propertyType.includes(listing.specifications.propertyType))) {
        return false;
      }
      
      // Bedrooms filter
      if (filters.bedrooms && 
          (!listing.specifications?.bedrooms || listing.specifications.bedrooms.toString() !== filters.bedrooms)) {
        return false;
      }
      
      // Features filter - optimized
      if (filters.features.length > 0 && !filters.features.every(feature => listing.features.includes(feature))) {
        return false;
      }
      
      return true;
    });
  }, [allListings, debouncedSearchQuery, filters]);

  const featuredListings = filteredListings.filter(listing => listing.featured);
  const regularListings = filteredListings.filter(listing => !listing.featured);

  const handleSearch = () => {
    // The filtering is already reactive through useMemo
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      type: 'all',
      location: '',
      priceMin: 0,
      priceMax: 50000000,
      yearMin: undefined,
      yearMax: undefined,
      condition: [],
      transmission: [],
      fuelType: [],
      propertyType: [],
      bedrooms: '',
      features: []
    });
  };

  const LoadingSkeleton = () => (
    <section id="listings" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-56 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <section id="listings" className="py-20 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Modern Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
            Premium <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Listings</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover exceptional vehicles and properties with unmatched quality and competitive prices
          </p>
          <div className="mt-8 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full"></div>
          </div>
        </div>

        {/* Modern Search Filters */}
        <div className="mb-12">
          {!showFilters ? (
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-between p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 animate-slide-up">
              <div className="flex items-center gap-6 flex-1">
                <div className="relative flex-1 max-w-lg">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vehicles and properties..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-white/40 rounded-full focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-white/90 transition-all duration-300 text-gray-700 placeholder-gray-400 shadow-sm"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Badge 
                    className={`cursor-pointer px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                      filters.type === 'all' 
                        ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg' 
                        : 'bg-white/70 text-gray-600 hover:bg-white/90 border border-white/40'
                    }`}
                    onClick={() => setFilters({ ...filters, type: 'all' })}
                  >
                    All ({allListings.length})
                  </Badge>
                  <Badge 
                    className={`cursor-pointer px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                      filters.type === 'car' 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                        : 'bg-white/70 text-gray-600 hover:bg-white/90 border border-white/40'
                    }`}
                    onClick={() => setFilters({ ...filters, type: 'car' })}
                  >
                    <Car className="h-3 w-3 mr-1" />
                    Cars ({allListings.filter(l => l.type === 'car').length})
                  </Badge>
                  <Badge 
                    className={`cursor-pointer px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                      filters.type === 'property' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                        : 'bg-white/70 text-gray-600 hover:bg-white/90 border border-white/40'
                    }`}
                    onClick={() => setFilters({ ...filters, type: 'property' })}
                  >
                    <Home className="h-3 w-3 mr-1" />
                    Properties ({allListings.filter(l => l.type === 'property').length})
                  </Badge>
                </div>
              </div>
              <Button 
                onClick={() => setShowFilters(true)}
                className="bg-white/80 backdrop-blur-sm text-gray-700 border border-white/40 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:border-primary/30 transition-all duration-300 px-6 py-3 rounded-full shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Search & Filter</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <AdvancedSearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                onSearch={handleSearch}
                onReset={handleResetFilters}
              />
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {filteredListings.length} of {allListings.length} listings
          </p>
          {(filters.searchQuery || filters.location || filters.condition.length > 0 || 
            filters.transmission.length > 0 || filters.fuelType.length > 0 || 
            filters.propertyType.length > 0 || filters.features.length > 0) && (
            <Button variant="ghost" size="sm" onClick={handleResetFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear all filters
            </Button>
          )}
        </div>

        {filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl text-muted-foreground mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No listings found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            {/* Modern Featured Listings Section */}
            {featuredListings.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center justify-center gap-4 mb-10">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary"></div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-center">
                    Featured Listings
                  </h3>
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg animate-bounce-subtle px-3 py-1">Premium</Badge>
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {featuredListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Modern Regular Listings */}
            {regularListings.length > 0 && (
              <div>
                <div className="flex items-center justify-center gap-4 mb-10">
                  <div className="h-px w-20 bg-gradient-to-r from-transparent to-gray-300"></div>
                  <h3 className="text-3xl font-bold text-gray-700 text-center">
                    {featuredListings.length > 0 ? "All Listings" : "Our Premium Collection"}
                  </h3>
                  <div className="h-px w-20 bg-gradient-to-l from-transparent to-gray-300"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {regularListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Modern Load More Button */}
            {hasNextPage && (
              <div className="text-center mt-16">
                <Button 
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white border-0 px-12 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-3" />
                      Loading more amazing listings...
                    </>
                  ) : (
                    `Load More Amazing Listings`
                  )}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Listing Modal */}
        <ListingModal
          listing={selectedListing}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </section>
  );
};

export default ListingsGrid;
