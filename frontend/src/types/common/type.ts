export interface DamulError {
  status: number;
  message: string;
  timestamp: string;
}

export interface InfiniteScrollType<T> {
  data: T[];
  meta: {
    nextCursor: number | string | null;
    hasNext: boolean;
  };
}
