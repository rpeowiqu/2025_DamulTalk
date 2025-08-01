import { type Dispatch, type SetStateAction } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FilterIcon from "@/components/icon/filter-icon";
import { cn } from "@/utils/style";

interface FilterButtonProps {
  title: string;
  filters: { label: string; value: string }[];
  selected: string;
  onSelect?: Dispatch<SetStateAction<string>>;
}

const FilterButton = ({
  title,
  filters,
  selected,
  onSelect,
}: FilterButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="cursor-pointer dark:text-neutral-200">
          <FilterIcon />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel className="font-bold">{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {filters.map((item) => (
          <DropdownMenuItem
            key={item.value}
            className={cn(
              "hover:bg-neutral-50 dark:hover:bg-neutral-600",
              item.value === selected
                ? "text-damul-main-500 dark:text-damul-main-300"
                : "text-neutral-500 dark:text-neutral-200",
            )}
            onClick={() => onSelect?.(item.value)}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterButton;
