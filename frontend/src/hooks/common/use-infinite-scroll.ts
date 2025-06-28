import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { useEffect, useRef } from "react";

interface UseInfiniteScrollOptions<T>
  extends UseInfiniteQueryOptions<T, Error, InfiniteData<T>> {
  rootMargin?: string;
  threshold?: number;
}

const useInfiniteScroll = <T>({
  rootMargin,
  threshold,
  ...props
}: UseInfiniteScrollOptions<T>) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const response = useInfiniteQuery({
    ...props,
  });

  useEffect(() => {
    if (!targetRef.current || response.isFetchingNextPage) {
      return;
    }

    const handleIntersect = ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting && response.hasNextPage) {
        response.fetchNextPage();
      }
    };
    const options = {
      rootMargin,
      threshold,
    };
    const observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(targetRef.current);

    return () => {
      observer.disconnect();
    };
  }, [
    rootMargin,
    threshold,
    response.hasNextPage,
    response.isFetchingNextPage,
    response.fetchNextPage,
  ]);

  return { targetRef, ...response };
};

export default useInfiniteScroll;
