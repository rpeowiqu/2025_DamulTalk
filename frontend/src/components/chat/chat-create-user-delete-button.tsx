import type { MouseEvent } from "react";
import { XIcon } from "lucide-react";

interface ChatCreateUserDeleteButtonProps {
  onClick: (_e: MouseEvent<HTMLButtonElement>) => void;
}

const ChatCreateUserDeleteButton = ({
  onClick,
}: ChatCreateUserDeleteButtonProps) => {
  return (
    <button
      className="absolute top-0 right-0 flex cursor-pointer items-center justify-center rounded-full bg-neutral-600 text-[0.625rem] font-bold"
      onClick={onClick}>
      <XIcon className="size-3 text-white" />
    </button>
  );
};

export default ChatCreateUserDeleteButton;
