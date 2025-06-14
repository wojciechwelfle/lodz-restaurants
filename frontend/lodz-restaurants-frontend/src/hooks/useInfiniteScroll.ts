import { useEffect, useCallback, type RefObject } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
}

export function useInfiniteScroll(
  ref: RefObject<HTMLElement> | RefObject<HTMLDivElement | null>,
  onLoadMore: () => void,
  options: UseInfiniteScrollOptions = {},
  isLoading = false,
  hasMore = true
): void {
  const { threshold = 100 } = options;

  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore || !ref.current) return;
    
    const element = ref.current;
    const rect = element.getBoundingClientRect();
    const isVisible = rect.top <= window.innerHeight + threshold;
    
    if (isVisible) {
      console.log("Element is visible, loading more...");
      onLoadMore();
    }
  }, [ref, onLoadMore, threshold, isLoading, hasMore]);

  useEffect(() => {
    const container = ref.current?.closest('.restaurant-list');

    const checkInitialVisibility = () => {
      if (ref.current && hasMore && !isLoading) {
        const rect = ref.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight + threshold) {
          console.log("Element is initially visible");
          onLoadMore();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    setTimeout(checkInitialVisibility, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [ref, handleScroll, onLoadMore, threshold, hasMore, isLoading]);
}
