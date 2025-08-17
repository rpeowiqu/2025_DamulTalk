import type { MouseEvent } from "react";

import UserPortrait from "@/components/community/user-portrait";
import ChatCreateUserDeleteButton from "@/components/chat/chat-create-user-delete-button";
import { cn } from "@/utils/style";
import type { User } from "@/types/community/type";

interface ChatCreateUserItemProps {
  user: User;
  className?: string;
  onDelete: (_e: MouseEvent<HTMLButtonElement>) => void;
}

const ChatCreateUserItem = ({
  user,
  className,
  onDelete,
}: ChatCreateUserItemProps) => {
  return (
    <div
      className={cn(
        "relative flex w-16 shrink-0 flex-col items-center gap-1 wrap-anywhere break-all select-none",
        className,
      )}>
      <UserPortrait profileImageUrl={user.profileImageUrl} />
      <p className="line-clamp-1 text-[0.75rem]" title={user.nickname}>
        {user.nickname}
      </p>

      <ChatCreateUserDeleteButton onClick={onDelete} />
    </div>
  );
};

export default ChatCreateUserItem;
