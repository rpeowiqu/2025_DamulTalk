import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/utils/style";

interface SideBarTabButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  selected: boolean;
  hasNewNotification: boolean;
}

const SideBarTabButton = ({
  label,
  selected,
  hasNewNotification,
  className,
  children,
  onClick,
  ...props
}: SideBarTabButtonProps) => {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-0.5 transition-colors duration-300",
          selected ? "text-white" : "text-neutral-500 dark:text-neutral-700",
          className,
        )}
        {...props}>
        {children}
        <p className="text-xs font-bold">{label}</p>
      </button>

      {hasNewNotification && (
        <div className="absolute top-0 right-0 size-2 rounded-full bg-red-500" />
      )}
    </div>
  );
};

export default SideBarTabButton;
