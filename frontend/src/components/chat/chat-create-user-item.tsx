import type { MouseEvent } from "react";

import UserPortrait from "@/components/user/user-portrait";
import ChatCreateUserDeleteButton from "@/components/chat/chat-create-user-delete-button";
import { cn } from "@/utils/style";
import type { UserInfo } from "@/types/user/type";

interface ChatCreateUserItemProps {
  userInfo: UserInfo;
  className?: string;
  onDelete: (_e: MouseEvent<HTMLButtonElement>) => void;
}

const ChatCreateUserItem = ({
  userInfo,
  className,
  onDelete,
}: ChatCreateUserItemProps) => {
  return (
    <div
      className={cn(
        "relative flex w-16 shrink-0 flex-col items-center gap-1 break-all select-none",
        className,
      )}>
      <UserPortrait profileImageUrl={userInfo.profileImageUrl} />
      <p className="line-clamp-1 text-[0.75rem]" title={userInfo.nickname}>
        {userInfo.nickname}
      </p>

      <ChatCreateUserDeleteButton onClick={onDelete} />
    </div>
  );
};

export default ChatCreateUserItem;
