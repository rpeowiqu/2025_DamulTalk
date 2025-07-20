import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { throttle } from "lodash-es";

import type { InfiniteScrollType } from "@/types/common/type";

interface UseInfiniteScrollOptions<T>
  extends UseInfiniteQueryOptions<
    InfiniteScrollType<T>,
    Error,
    InfiniteData<InfiniteScrollType<T>>
  > {
  rootMargin?: string;
  threshold?: number;
  fetchDelay?: number;
}

const useInfiniteScroll = <T>({
  rootMargin,
  threshold,
  fetchDelay = 0,
  enabled,
  ...props
}: UseInfiniteScrollOptions<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const previousScrollHeight = useRef<number>(0);

  const response = useInfiniteQuery({
    ...props,
    refetchOnWindowFocus: false,
    retry: 0,
  });

  const handleBeforeFetch = () => {
    if (!containerRef.current) {
      return;
    }

    previousScrollHeight.current = containerRef.current.scrollHeight;
  };

  const handleIntersect = useMemo(() => {
    const onIntersect = () => {
      if (response.hasNextPage && !response.isFetchingNextPage && enabled) {
        handleBeforeFetch();
        response.fetchNextPage();
      }
    };

    // throttleDelay가 0 이하이면 쓰로틀 적용 없이 원본 함수 그대로 사용
    if (fetchDelay <= 0) {
      return onIntersect;
    }

    // throttle 적용: 호출 이후 fetchDelay초전까지 리패칭을 수행하지 않도록 설정
    return throttle(onIntersect, fetchDelay, {
      leading: true,
      trailing: false,
    });
  }, [
    fetchDelay,
    response.hasNextPage,
    response.isFetchingNextPage,
    response.fetchNextPage,
    enabled,
  ]);

  useLayoutEffect(() => {
    if (!containerRef.current || !previousScrollHeight.current) {
      return;
    }

    const newContentHeight =
      containerRef.current.scrollHeight - previousScrollHeight.current;
    containerRef.current.scrollTop = newContentHeight;
    previousScrollHeight.current = 0;
  }, [response.data?.pages.length]);

  useEffect(() => {
    if (!targetRef.current) {
      return;
    }

    const options = {
      rootMargin,
      threshold,
    };
    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting) {
          handleIntersect();
        }
      },
      options,
    );
    observer.observe(targetRef.current);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold, handleIntersect]);

  return { containerRef, targetRef, ...response };
};

export default useInfiniteScroll;
