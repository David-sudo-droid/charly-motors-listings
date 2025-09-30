import React, { useState, useMemo } from "react";
import ListingCard from "./ListingCard";
import ListingModal from "./ListingModal";
import AdvancedSearchFilters, { AdvancedFilters } from "./AdvancedSearchFilters";
import { useListings, type Listing } from "@/hooks/useListings";
import { Loader2, Search, Car, Home, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const ListingsGrid = () => {
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = useListings();
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

  const filteredListings = useMemo(() => {
    return allListings.filter((listing) => {
      // Type filter
      const matchesType = filters.type === 'all' || listing.type === filters.type;
      
      // Search query
      const matchesSearch = !filters.searchQuery || 
        listing.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        listing.location.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        listing.description?.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      // Location filter
      const matchesLocation = !filters.location ||
        listing.location.toLowerCase().includes(filters.location.toLowerCase());
      
      // Price filter
      const matchesPrice = listing.price >= filters.priceMin && listing.price <= filters.priceMax;
      
      // Year filter (for cars)
      const matchesYear = !filters.yearMin && !filters.yearMax ? true :
        (listing.specifications?.year ? 
          (!filters.yearMin || listing.specifications.year >= filters.yearMin) &&
          (!filters.yearMax || listing.specifications.year <= filters.yearMax)
          : true);
      
      // Condition filter
      const matchesCondition = filters.condition.length === 0 ||
        (listing.specifications?.condition && filters.condition.includes(listing.specifications.condition));
      
      // Transmission filter
      const matchesTransmission = filters.transmission.length === 0 ||
        (listing.specifications?.transmission && filters.transmission.includes(listing.specifications.transmission));
      
      // Fuel type filter
      const matchesFuelType = filters.fuelType.length === 0 ||
        (listing.specifications?.fuelType && filters.fuelType.includes(listing.specifications.fuelType));
      
      // Property type filter
      const matchesPropertyType = filters.propertyType.length === 0 ||
        (listing.specifications?.propertyType && filters.propertyType.includes(listing.specifications.propertyType));
      
      // Bedrooms filter
      const matchesBedrooms = !filters.bedrooms ||
        (listing.specifications?.bedrooms && listing.specifications.bedrooms.toString() === filters.bedrooms);
      
      // Features filter
      const matchesFeatures = filters.features.length === 0 ||
        filters.features.every(feature => listing.features.includes(feature));
      
      return matchesType && matchesSearch && matchesLocation && matchesPrice && 
             matchesYear && matchesCondition && matchesTransmission && 
             matchesFuelType && matchesPropertyType && matchesBedrooms && matchesFeatures;
    });
  }, [allListings, filters]);

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
    <section id="listings" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Premium <span className="text-accent">Listings</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover quality vehicles and properties at competitive prices
          </p>
        </div>

        {/* Advanced Search Filters */}
        <div className="mb-8">
          {!showFilters ? (
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Quick search..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <Badge 
                    variant={filters.type === 'all' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setFilters({ ...filters, type: 'all' })}
                  >
                    All ({allListings.length})
                  </Badge>
                  <Badge 
                    variant={filters.type === 'car' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setFilters({ ...filters, type: 'car' })}
                  >
                    <Car className="h-3 w-3 mr-1" />
                    Cars ({allListings.filter(l => l.type === 'car').length})
                  </Badge>
                  <Badge 
                    variant={filters.type === 'property' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setFilters({ ...filters, type: 'property' })}
                  >
                    <Home className="h-3 w-3 mr-1" />
                    Properties ({allListings.filter(l => l.type === 'property').length})
                  </Badge>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
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
            {/* Featured Listings */}
            {featuredListings.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="text-2xl font-bold">Featured Listings</h3>
                  <Badge className="bg-accent text-accent-foreground">Premium</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <h3 className="text-2xl font-bold mb-6">
                  {featuredListings.length > 0 ? "All Listings" : "Our Listings"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

            {/* Load More Button */}
            {hasNextPage && (
              <div className="text-center mt-12">
                <Button 
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  size="lg"
                  variant="outline"
                  className="px-8"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading more...
                    </>
                  ) : (
                    `Load More Listings`
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
