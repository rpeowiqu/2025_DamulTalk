import type { FormEvent, InputHTMLAttributes } from "react";

import SearchIcon from "@/components/icon/search-icon";
import { cn } from "@/utils/style";

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch: (_keyword: string) => void;
}

const SearchBar = ({ onSearch, className, ...props }: SearchBarProps) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const keyword = formData.get("search-keyword") as string;
    onSearch(keyword);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="group flex items-center gap-3 rounded-xl bg-neutral-100 px-4 py-3 ring-neutral-500 ring-inset focus-within:ring-2">
      <SearchIcon
        className={cn("text-neutral-300 group-focus-within:text-neutral-500")}
      />
      <input
        name="search-keyword"
        className={cn("w-full focus:outline-none", className)}
        {...props}
      />
    </form>
  );
};

export default SearchBar;
