// Lazy loading components to improve initial load performance
import { lazy } from 'react';

// Lazy load heavy components that aren't needed immediately
export const LazyListingModal = lazy(() => import('./ListingModal').then(module => ({ default: module.default })));

export const LazyAdvancedSearchFilters = lazy(() => import('./AdvancedSearchFilters').then(module => ({ default: module.default })));

// Performance monitoring components - only load when needed
export const LazyPerformanceMonitoring = lazy(() => 
  import('@/hooks/usePerformanceMonitoring').then(module => ({
    default: () => {
      const { usePerformanceMonitoring } = module;
      usePerformanceMonitoring('ListingsGrid');
      return null;
    }
  }))
);
