import { XIcon } from "lucide-react";
import type { MouseEvent } from "react";

interface SideBarCloseButtonProps {
  onClick: (_e: MouseEvent<HTMLButtonElement>) => void;
}

const SideBarCloseButton = ({ onClick }: SideBarCloseButtonProps) => {
  return (
    <button
      className="flex cursor-pointer items-center justify-center text-xl xl:hidden"
      onClick={onClick}>
      <XIcon className="text-neutral-500 dark:text-neutral-100" />
    </button>
  );
};

export default SideBarCloseButton;
