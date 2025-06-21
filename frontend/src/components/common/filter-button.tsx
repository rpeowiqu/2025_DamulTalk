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
        <button type="button" className="cursor-pointer">
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
              item.value === selected
                ? "text-damul-main-500 bg-damul-main-50"
                : "text-neutral-500",
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
