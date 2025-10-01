import { useState, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Car, Home } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  listingType?: 'car' | 'property';
  priority?: boolean;
  quality?: number;
}

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width = 800, 
  height = 600,
  listingType = 'car',
  priority = false,
  quality = 80
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Optimized Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return; // Skip observer if priority loading

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.05, // Reduced threshold for earlier loading
        rootMargin: '100px' // Increased margin for prefetching
      }
    );

    const currentRef = imgRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [priority]);

  // Aggressively optimize image URLs for better performance
  const getOptimizedImageUrl = (url: string) => {
    if (!url.includes('unsplash.com')) return url;
    
    // Extract base URL and add aggressive optimization parameters
    const baseUrl = url.split('?')[0];
    // Use smaller dimensions for better loading speed
    const optWidth = Math.min(width, 600); // Max 600px width
    const optHeight = Math.min(height, 400); // Max 400px height
    return `${baseUrl}?w=${optWidth}&h=${optHeight}&fit=crop&q=${quality}&auto=format&fm=webp`;
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const optimizedSrc = getOptimizedImageUrl(src);

  return (
    <div ref={imgRef} className={`relative overflow-hidden bg-muted ${className}`}>
      {/* Loading skeleton */}
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
          {listingType === 'car' ? (
            <Car className="h-16 w-16 text-primary/70" />
          ) : (
            <Home className="h-16 w-16 text-primary/70" />
          )}
        </div>
      )}

      {/* Actual image - only render when in view (or priority) */}
      {isInView && (
        <img
          src={optimizedSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          // Preload critical images
          {...(priority && { fetchPriority: 'high' as any })}
        />
      )}
    </div>
  );
};

export default OptimizedImage;