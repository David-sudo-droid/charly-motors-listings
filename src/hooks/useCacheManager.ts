import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ListingsCache } from '@/utils/listingsCache';

/**
 * Hook for managing listings cache
 * Provides methods to clear, refresh, and get cache statistics
 */
export const useCacheManager = () => {
  const queryClient = useQueryClient();

  // Clear all cache (both localStorage and React Query)
  const clearAllCache = useCallback(() => {
    try {
      // Clear localStorage cache
      ListingsCache.clear();
      
      // Clear React Query cache
      queryClient.clear();
      
      console.log('All cache cleared successfully');
      return true;
    } catch (error) {
      console.error('Failed to clear cache:', error);
      return false;
    }
  }, [queryClient]);

  // Clear only expired cache entries
  const clearExpiredCache = useCallback(() => {
    try {
      ListingsCache.clearExpiredEntries();
      console.log('Expired cache entries cleared');
      return true;
    } catch (error) {
      console.error('Failed to clear expired cache:', error);
      return false;
    }
  }, []);

  // Force refresh of all listings data
  const refreshListings = useCallback(async () => {
    try {
      // Clear relevant cache entries
      ListingsCache.remove(ListingsCache.KEYS.FEATURED_LISTINGS);
      ListingsCache.remove(ListingsCache.KEYS.ALL_LISTINGS);
      
      // Clear and refetch React Query cache for listings
      await queryClient.invalidateQueries({ queryKey: ['listings'] });
      
      console.log('Listings refreshed successfully');
      return true;
    } catch (error) {
      console.error('Failed to refresh listings:', error);
      return false;
    }
  }, [queryClient]);

  // Get cache statistics
  const getCacheStats = useCallback(() => {
    try {
      const stats = ListingsCache.getStats();
      return {
        ...stats,
        hasCache: stats.totalEntries > 0,
        formattedSize: formatBytes(stats.totalSize),
        oldestEntry: stats.oldestEntry ? new Date(stats.oldestEntry).toLocaleString() : null,
        newestEntry: stats.newestEntry ? new Date(stats.newestEntry).toLocaleString() : null,
      };
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return {
        totalEntries: 0,
        totalSize: 0,
        oldestEntry: null,
        newestEntry: null,
        hasCache: false,
        formattedSize: '0 B',
      };
    }
  }, []);

  // Check if specific data is cached
  const isCached = useCallback((type: 'featured' | 'all' | 'listing', id?: string) => {
    try {
      switch (type) {
        case 'featured':
          return ListingsCache.has(ListingsCache.KEYS.FEATURED_LISTINGS);
        case 'all':
          return ListingsCache.has(ListingsCache.KEYS.ALL_LISTINGS);
        case 'listing':
          return id ? ListingsCache.has(`${ListingsCache.KEYS.LISTING_DETAILS}${id}`) : false;
        default:
          return false;
      }
    } catch (error) {
      console.error('Failed to check cache status:', error);
      return false;
    }
  }, []);

  // Preload listings into cache
  const preloadListings = useCallback(async () => {
    try {
      // This will trigger the queries and populate the cache
      await queryClient.prefetchQuery({
        queryKey: ['listings', 'featured'],
        staleTime: 1000 * 60 * 10, // 10 minutes
      });

      await queryClient.prefetchQuery({
        queryKey: ['listings', 'all'],
        staleTime: 1000 * 60 * 10, // 10 minutes
      });

      console.log('Listings preloaded successfully');
      return true;
    } catch (error) {
      console.error('Failed to preload listings:', error);
      return false;
    }
  }, [queryClient]);

  return {
    clearAllCache,
    clearExpiredCache,
    refreshListings,
    getCacheStats,
    isCached,
    preloadListings,
  };
};

// Helper function to format bytes
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default useCacheManager;
