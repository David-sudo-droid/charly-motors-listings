import { useEffect, useRef, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  onIntersect?: () => void;
}

export const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = '100px',
  onIntersect,
}: UseIntersectionObserverOptions) => {
  const targetRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        onIntersect?.();
      }
    },
    [onIntersect]
  );

  useEffect(() => {
    const element = targetRef.current;
    if (!element || !onIntersect) return;

    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [handleIntersect, threshold, rootMargin, onIntersect]);

  return targetRef;
};
