import { useEffect } from 'react';

interface PerformanceMetrics {
  component: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

// Simple performance monitoring hook
export const usePerformanceMonitoring = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔍 Performance: ${componentName} took ${duration.toFixed(2)}ms`);
        
        // Warn about slow components
        if (duration > 100) {
          console.warn(`⚠️ Slow component: ${componentName} took ${duration.toFixed(2)}ms`);
        }
      }
    };
  }, [componentName]);
};

// Hook for measuring specific operations
export const useOperationTimer = () => {
  const startTimer = (operation: string) => {
    const startTime = performance.now();
    
    return {
      end: () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`⏱️ Operation: ${operation} took ${duration.toFixed(2)}ms`);
        }
        
        return duration;
      }
    };
  };
  
  return { startTimer };
};

// Hook for monitoring React Query performance
export const useQueryPerformanceMonitoring = (queryKey: string[], data: any, isLoading: boolean) => {
  useEffect(() => {
    if (!isLoading && data) {
      const itemCount = Array.isArray(data.pages) 
        ? data.pages.reduce((total: number, page: any) => total + (page.listings?.length || 0), 0)
        : Array.isArray(data) ? data.length : 1;
        
      if (process.env.NODE_ENV === 'development') {
        console.log(`📊 Query: ${queryKey.join('/')} loaded ${itemCount} items`);
      }
    }
  }, [queryKey, data, isLoading]);
};