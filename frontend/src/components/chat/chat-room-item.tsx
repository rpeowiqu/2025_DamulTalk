import type { MouseEvent } from "react";

import { cn } from "@/utils/style";
import ChatPortrait from "@/components/chat/chat-portrait";
import UserIcon from "@/components/icon/user-icon";
import type { ChatRoomPreview } from "@/types/chat/type";

interface ChatRoomItemProps {
  chatRoomPreview: ChatRoomPreview;
  selected: boolean;
  className?: string;
  onClick?: (_e: MouseEvent<HTMLDivElement>) => void;
}

const ChatRoomItem = ({
  chatRoomPreview,
  selected,
  className,
  onClick,
}: ChatRoomItemProps) => {
  return (
    <div
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 rounded-xl bg-white p-2 hover:bg-neutral-50 dark:bg-neutral-800 dark:hover:bg-neutral-700",
        className,
      )}
      onClick={onClick}>
      <ChatPortrait
        profileImageUrls={chatRoomPreview.profileImageUrls}
        unreadMessageNum={chatRoomPreview.unReadMessageCount}
      />

      <div className="flex flex-1 flex-col break-all">
        <div className="flex gap-3">
          <h1
            className={cn(
              "line-clamp-1 flex-1 font-bold dark:text-white",
              selected && "text-damul-main-300 dark:text-damul-main-300",
            )}>
            {chatRoomPreview.roomName}
          </h1>
          <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-200">
            <UserIcon className="size-3" />
            <p className="text-xs">{chatRoomPreview.roomSize}</p>
          </div>
        </div>

        <p className="line-clamp-1 text-neutral-500 dark:text-neutral-200">
          {chatRoomPreview.lastMessage}
        </p>
      </div>
    </div>
  );
};

export default ChatRoomItem;
