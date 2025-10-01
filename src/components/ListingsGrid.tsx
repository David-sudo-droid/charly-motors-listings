import React, { useState, useMemo, useCallback, useEffect } from "react";
import ListingCard from "./ListingCard";
import ListingModal from "./ListingModal";
import SimpleSearchFilters, { SimpleFilters } from "./SimpleSearchFilters";
import { useListings, useFeaturedListings, type Listing } from "@/hooks/useListings";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useFavorites } from "@/hooks/useFavorites";
import { Loader2, Search, Car, Home, Filter, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ListingsSkeleton from "./ListingsSkeleton";

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
  // Load featured listings first for faster perceived performance
  const { data: featuredData, isLoading: featuredLoading } = useFeaturedListings();
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = useListings();
  
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showFeaturedFirst, setShowFeaturedFirst] = useState(true);

  const [filters, setFilters] = useState<SimpleFilters>({
    searchQuery: '',
    type: 'all',
    location: '',
    priceMin: 0,
    priceMax: 50000000,
  });

  // Debounce search query for better performance
  const debouncedSearchQuery = useDebounce(filters.searchQuery, 300);
  
  // Combine featured and regular listings efficiently
  const allListings = useMemo(() => {
    if (!data && !featuredData) return [];
    
    const regularListings = data?.pages.flatMap(page => page.listings) || [];
    const featuredListings = featuredData || [];
    
    // Remove duplicates more efficiently
    if (featuredListings.length === 0) return regularListings;
    if (regularListings.length === 0) return featuredListings;
    
    const regularIds = new Set(regularListings.map(listing => listing.id));
    const uniqueFeatured = featuredListings.filter(listing => !regularIds.has(listing.id));
    
    return [...uniqueFeatured, ...regularListings];
  }, [data, featuredData]);

  // Optimized stats calculation
  const listingStats = useMemo(() => {
    if (!allListings.length) return { cars: 0, properties: 0, total: 0 };
    
    let cars = 0;
    let properties = 0;
    
    // Single pass instead of multiple filters
    for (const listing of allListings) {
      if (listing.type === 'car') cars++;
      else if (listing.type === 'property') properties++;
    }
    
    return { cars, properties, total: allListings.length };
  }, [allListings]);

  const handleViewDetails = (listing: Listing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedListing(null);
  };

  // Highly optimized filtering with early exits and minimal work
  const filteredListings = useMemo(() => {
    if (!allListings.length) return [];
    
    // Simple, fast filtering
    const searchQuery = debouncedSearchQuery?.toLowerCase();
    const hasLocationFilter = filters.location?.toLowerCase();
    
    // If no filters, return all listings immediately
    if (!searchQuery && !hasLocationFilter && filters.type === 'all' && 
        filters.priceMin === 0 && filters.priceMax === 50000000) {
      return allListings;
    }
    
    return allListings.filter((listing) => {
      // Type filter
      if (filters.type !== 'all' && listing.type !== filters.type) return false;
      
      // Price filter
      if (listing.price < filters.priceMin || listing.price > filters.priceMax) return false;
      
      // Search query - simple text matching
      if (searchQuery) {
        const searchableText = `${listing.title} ${listing.location}`.toLowerCase();
        if (!searchableText.includes(searchQuery)) return false;
      }
      
      // Location filter
      if (hasLocationFilter && !listing.location.toLowerCase().includes(hasLocationFilter)) {
        return false;
      }
      
      return true;
    });
  }, [allListings, debouncedSearchQuery, filters]);

  // Split listings efficiently in one pass
  const { featuredListings, regularListings } = useMemo(() => {
    const featured: Listing[] = [];
    const regular: Listing[] = [];
    
    for (const listing of filteredListings) {
      if (listing.featured) {
        featured.push(listing);
      } else {
        regular.push(listing);
      }
    }
    
    return { featuredListings: featured, regularListings: regular };
  }, [filteredListings]);

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
    });
  };

  // Show progressive loading - featured first, then regular listings
  if (featuredLoading && isLoading) {
    return (
      <section id="listings" className="py-4 sm:py-6 lg:py-8 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30 min-h-screen">
        <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
          <ListingsSkeleton count={9} showFeatured={true} />
        </div>
      </section>
    );
  }

  return (
    <section id="listings" className="py-4 sm:py-6 lg:py-8 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30 min-h-screen">
      <div className="container mx-auto px-3 sm:px-4 max-w-7xl">

        {/* Search Filters */}
        <div className="mb-4 sm:mb-6">
          {!showFilters ? (
            <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 animate-slide-up">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vehicles and properties..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-white/40 rounded-full focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-white/90 transition-all duration-300 text-sm sm:text-base text-gray-700 placeholder-gray-400 shadow-sm"
                  />
                </div>
                <Button 
                  onClick={() => setShowFilters(true)}
                  className="bg-white/80 backdrop-blur-sm text-gray-700 border border-white/40 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:border-primary/30 transition-all duration-300 px-4 sm:px-6 py-3 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 whitespace-nowrap"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Advanced Filters</span>
                  <span className="sm:hidden">Filters</span>
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                <Badge 
                  className={`cursor-pointer px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm ${
                    filters.type === 'all' 
                      ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg' 
                      : 'bg-white/70 text-gray-600 hover:bg-white/90 border border-white/40'
                  }`}
                  onClick={() => setFilters({ ...filters, type: 'all' })}
                >
                  All ({listingStats.total})
                </Badge>
                <Badge 
                  className={`cursor-pointer px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm ${
                    filters.type === 'car' 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                      : 'bg-white/70 text-gray-600 hover:bg-white/90 border border-white/40'
                  }`}
                  onClick={() => setFilters({ ...filters, type: 'car' })}
                >
                  <Car className="h-3 w-3 mr-1" />
                  Cars ({listingStats.cars})
                </Badge>
                <Badge 
                  className={`cursor-pointer px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm ${
                    filters.type === 'property' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                      : 'bg-white/70 text-gray-600 hover:bg-white/90 border border-white/40'
                  }`}
                  onClick={() => setFilters({ ...filters, type: 'property' })}
                >
                  <Home className="h-3 w-3 mr-1" />
                  Properties ({listingStats.properties})
                </Badge>
              </div>
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
              <SimpleSearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                onSearch={handleSearch}
                onReset={handleResetFilters}
              />
            </div>
          )}
        </div>

        {/* Results Summary - Mobile optimized */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 sm:mb-4">
          <p className="text-sm sm:text-base text-muted-foreground">
            {filteredListings.length} of {allListings.length} listings
          </p>
          {(filters.searchQuery || filters.location) && (
            <Button variant="ghost" size="sm" onClick={handleResetFilters} className="text-xs sm:text-sm">
              <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
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
            {/* Featured Listings */}
            {featuredListings.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                    Featured
                  </h3>
                  <Badge className="bg-yellow-500 text-white px-2 py-0.5 text-xs">Premium</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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

            {/* Regular Listings */}
            {regularListings.length > 0 && (
              <div>
                {featuredListings.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                      All Listings
                    </h3>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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

            {/* Optimized Load More with Intersection Observer */}
            {hasNextPage && (
              <div className="text-center mt-10 sm:mt-12 lg:mt-16">
                <div 
                  ref={useIntersectionObserver({
                    threshold: 0.5,
                    rootMargin: '200px',
                    onIntersect: () => {
                      if (!isFetchingNextPage && hasNextPage) {
                        fetchNextPage();
                      }
                    },
                  })}
                >
                  <Button 
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white border-0 px-8 sm:px-10 lg:px-12 py-3 sm:py-4 text-sm sm:text-base lg:text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-full sm:w-auto"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2 sm:mr-3" />
                        <span className="hidden sm:inline">Loading more amazing listings...</span>
                        <span className="sm:hidden">Loading more...</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Load More Amazing Listings</span>
                        <span className="sm:hidden">Load More Listings</span>
                      </>
                    )}
                  </Button>
                </div>
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
