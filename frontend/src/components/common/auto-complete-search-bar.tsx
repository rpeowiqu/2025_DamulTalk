import {
  useMemo,
  useState,
  type Dispatch,
  type InputHTMLAttributes,
  type ReactNode,
  type SetStateAction,
} from "react";
import type {
  InfiniteData,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { debounce } from "lodash-es";

import SearchBar from "@/components/common/search-bar";
import useInfiniteScroll from "@/hooks/common/use-infinite-scroll";
import type { InfiniteScrollType } from "@/types/common/type";

interface AutocompleteSearchBarProps<T>
  extends InputHTMLAttributes<HTMLInputElement> {
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
  onSearch?: (_keyword: string) => void;
  infiniteQueryOptions: UseInfiniteQueryOptions<
    InfiniteScrollType<T>,
    Error,
    InfiniteData<InfiniteScrollType<T>>
  >;
  renderItem: (_item: T, _keyword: string) => ReactNode;
  renderSkeleton: () => ReactNode;
}

const AutocompleteSearchBar = <T,>({
  keyword,
  setKeyword,
  infiniteQueryOptions,
  renderItem,
  renderSkeleton,
  ...props
}: AutocompleteSearchBarProps<T>) => {
  const [isFocused, setIsFocused] = useState(true);
  const { targetRef, data, isLoading, isFetchingNextPage } = useInfiniteScroll({
    ...infiniteQueryOptions,
  });

  const handleSearch = (keyword: string) => {
    setKeyword(keyword);
  };

  const handleChange = useMemo(
    () => debounce((keyword: string) => setKeyword(keyword), 300),
    [],
  );

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const isEmpty = !data?.pages.some((page) => page.data.length > 0);

  return (
    <div className="relative">
      <SearchBar
        {...props}
        onSearch={handleSearch}
        onChangeKeyword={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

      {isFocused && (!isEmpty || isLoading) && (
        <div className="absolute top-full left-0 mt-2 flex h-fit max-h-44 w-full flex-col gap-1 overflow-y-auto rounded-md border border-neutral-100 bg-white p-2 pt-3 shadow-md">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => {
                const Skeleton = renderSkeleton;
                return <Skeleton key={index} />;
              })
            : data?.pages.map((page) =>
                page.data.map((item) => renderItem(item, keyword)),
              )}

          {isFetchingNextPage ? null : <div ref={targetRef} />}
        </div>
      )}
    </div>
  );
};

export default AutocompleteSearchBar;
