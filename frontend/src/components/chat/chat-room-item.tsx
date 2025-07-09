import type { MouseEvent } from "react";

import { cn } from "@/utils/style";
import ChatPortrait from "@/components/chat/chat-portrait";
import UserIcon from "@/components/icon/user-icon";
import type { ChatRoomPreview } from "@/types/chat/type";

interface ChatRoomItemProps {
  chatRoomPreview: ChatRoomPreview;
  selected: boolean;
  onClick?: (_e: MouseEvent<HTMLDivElement>) => void;
  className?: string;
}

const ChatRoomItem = ({
  chatRoomPreview,
  selected,
  className,
}: ChatRoomItemProps) => {
  return (
    <div
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 rounded-xl bg-white p-2 hover:bg-neutral-50",
        className,
      )}>
      <ChatPortrait
        profileImages={chatRoomPreview.profileImageUrls}
        unreadMessageNum={chatRoomPreview.unReadMessageCount}
      />

      <div className="flex flex-1 flex-col break-all">
        <div className="flex gap-3">
          <h1
            className={cn(
              "line-clamp-1 flex-1 font-bold",
              selected && "text-damul-main-300",
            )}>
            {chatRoomPreview.roomName}
          </h1>
          <div className="flex items-center gap-1 text-neutral-500">
            <UserIcon className="size-3" />
            <p className="text-xs">{chatRoomPreview.roomSize}</p>
          </div>
        </div>

        <p className="line-clamp-1 text-neutral-500">
          {chatRoomPreview.lastMessage}
        </p>
      </div>
    </div>
  );
};

export default ChatRoomItem;
