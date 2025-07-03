export interface InfiniteScrollType<T> {
  data: T[];
  meta: {
    nextCursor: number | string | null;
    hasNext: boolean;
  };
}
