import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ListingsSkeletonProps {
  count?: number;
  showFeatured?: boolean;
}

const ListingCardSkeleton = React.memo(() => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
    {/* Image skeleton */}
    <div className="h-48 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 relative">
      {/* Badges skeleton */}
      <div className="absolute top-3 left-3 flex gap-2">
        <Skeleton className="h-6 w-16 bg-gradient-to-r from-orange-200 to-orange-300 rounded-full" />
      </div>
      {/* Action buttons skeleton */}
      <div className="absolute top-3 right-3 flex gap-1">
        <Skeleton className="h-8 w-8 rounded-md bg-white/70" />
        <Skeleton className="h-8 w-8 rounded-md bg-white/70" />
      </div>
      {/* Image count skeleton */}
      <div className="absolute bottom-2 right-2">
        <Skeleton className="h-5 w-12 rounded bg-black/70" />
      </div>
    </div>
    
    {/* Content skeleton */}
    <div className="p-4 space-y-3">
      {/* Price */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32 bg-gradient-to-r from-green-200 to-green-300" />
      </div>
      
      {/* Title */}
      <Skeleton className="h-6 w-4/5 bg-gradient-to-r from-gray-200 to-gray-300" />
      
      {/* Key specs grid */}
      <div className="grid grid-cols-2 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 bg-gray-300 rounded" />
            <Skeleton className="h-4 w-12 bg-gray-300" />
          </div>
        ))}
      </div>
      
      {/* Location */}
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4 bg-gray-300 rounded" />
        <Skeleton className="h-4 w-24 bg-gray-300" />
      </div>
      
      {/* Dealer info */}
      <div className="border-t pt-2">
        <Skeleton className="h-3 w-32 bg-gray-200" />
      </div>
    </div>
    
    {/* Footer skeleton */}
    <div className="p-4 pt-0 flex gap-2 border-t">
      <Skeleton className="flex-1 h-9 bg-gradient-to-r from-gray-200 to-gray-300 rounded" />
      <Skeleton className="flex-1 h-9 bg-gradient-to-r from-blue-200 to-blue-300 rounded" />
    </div>
  </div>
));

ListingCardSkeleton.displayName = 'ListingCardSkeleton';

const FeaturedSectionSkeleton = React.memo(() => (
  <div className="mb-8">
    {/* Featured header */}
    <div className="flex items-center gap-2 mb-4">
      <Skeleton className="h-6 w-20 bg-gradient-to-r from-yellow-200 to-yellow-300" />
      <Skeleton className="h-5 w-16 bg-orange-200 rounded-full" />
    </div>
    
    {/* Featured listings grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <ListingCardSkeleton key={`featured-${i}`} />
      ))}
    </div>
  </div>
));

FeaturedSectionSkeleton.displayName = 'FeaturedSectionSkeleton';

const ListingsSkeleton: React.FC<ListingsSkeletonProps> = ({ 
  count = 6, 
  showFeatured = false 
}) => {
  return (
    <div className="space-y-6">
      {showFeatured && <FeaturedSectionSkeleton />}
      
      {/* Regular listings section */}
      {showFeatured && (
        <div className="mb-4">
          <Skeleton className="h-6 w-24 bg-gradient-to-r from-gray-200 to-gray-300" />
        </div>
      )}
      
      {/* Regular listings grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(count)].map((_, i) => (
          <ListingCardSkeleton key={`regular-${i}`} />
        ))}
      </div>
      
      {/* Load more skeleton */}
      <div className="text-center mt-12">
        <Skeleton className="h-12 w-48 mx-auto bg-gradient-to-r from-primary/20 to-accent/20 rounded-full" />
      </div>
    </div>
  );
};

export default ListingsSkeleton;
