import { LogOutIcon } from "lucide-react";

import ChatPortrait from "@/components/chat/chat-portrait";
import UserIcon from "@/components/icon/user-icon";
import SearchIcon from "@/components/icon/search-icon";
import type { ChatRoomInfo } from "@/types/chat/type";

interface ChatRoomHeaderProps {
  roomInfo: ChatRoomInfo;
}

const ChatRoomHeader = ({ roomInfo }: ChatRoomHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-6 border-b border-neutral-200 bg-white px-6 py-4">
      <div className="flex flex-1 items-center gap-4">
        <ChatPortrait profileImages={roomInfo.profileImages} />
        <div className="flex flex-col break-all">
          <h1 className="line-clamp-1 text-lg font-bold">
            {roomInfo.roomName}
          </h1>
          <div className="flex items-center gap-1 text-neutral-500">
            <UserIcon className="size-4" />
            <p>{roomInfo.roomSize}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5 text-neutral-500">
        <button className="cursor-pointer">
          <SearchIcon />
        </button>
        <button className="cursor-pointer">
          <LogOutIcon />
        </button>
      </div>
    </div>
  );
};

export default ChatRoomHeader;
