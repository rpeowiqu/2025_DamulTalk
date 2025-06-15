import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/utils/style";

interface SideBarTabButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  selected: boolean;
}

const SideBarTabButton = ({
  label,
  selected,
  className,
  children,
  onClick,
  ...props
}: SideBarTabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex cursor-pointer flex-col items-center gap-0.5 transition-colors duration-300",
        selected ? "text-white" : "text-neutral-500",
        className,
      )}
      {...props}>
      {children}
      <p className="text-xs font-bold">{label}</p>
    </button>
  );
};

export default SideBarTabButton;
