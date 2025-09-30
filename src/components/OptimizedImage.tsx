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

  // Intersection Observer for lazy loading
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
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Optimize Unsplash URLs with proper dimensions and quality
  const getOptimizedImageUrl = (url: string) => {
    if (!url.includes('unsplash.com')) return url;
    
    // Extract base URL and add optimization parameters
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?w=${width}&h=${height}&fit=crop&q=${quality}&auto=format`;
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