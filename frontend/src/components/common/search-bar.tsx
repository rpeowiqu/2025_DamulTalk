import { useRef, type InputHTMLAttributes, type KeyboardEvent } from "react";

import SearchIcon from "@/components/icon/search-icon";
import { cn } from "@/utils/style";

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch: (_keyword: string) => void;
}

const SearchBar = ({ onSearch, className, ...props }: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const keyword = inputRef.current?.value.trim() || "";
      onSearch(keyword);
    }
  };

  return (
    <div className="group ring-damul-main-300 flex items-center gap-3 rounded-xl bg-neutral-100 px-4 py-3 ring-inset focus-within:ring-2">
      <SearchIcon
        className={cn(
          "group-focus-within:text-damul-main-300 text-neutral-300",
        )}
      />
      <input
        ref={inputRef}
        onKeyDown={handleKeyDown}
        className={cn("w-full focus:outline-none", className)}
        {...props}
      />
    </div>
  );
};

export default SearchBar;
