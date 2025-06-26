import type { ChatRoomInfo } from "@/types/chat/type";
import ChatPortrait from "@/components/chat/chat-portrait";
import UserIcon from "@/components/icon/user-icon";
import ChatRoomExitButton from "@/components/chat/chat-room-exit-button";
import ChatRoomSearchButton from "@/components/chat/chat-room-search-button";

interface ChatRoomHeaderProps {
  room: ChatRoomInfo;
}

const ChatRoomHeader = ({ room }: ChatRoomHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-6 border-b border-neutral-200 bg-white px-6 py-4">
      <div className="flex flex-1 items-center gap-4">
        <ChatPortrait profileImages={room.profileImages} />
        <div className="flex flex-col break-all">
          <h1 className="line-clamp-1 text-lg font-bold">{room.roomName}</h1>
          <div className="flex items-center gap-1 text-neutral-500">
            <UserIcon className="size-4" />
            <p>{room.roomSize}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5 text-neutral-500">
        <ChatRoomSearchButton />
        <ChatRoomExitButton room={room} />
      </div>
    </div>
  );
};

export default ChatRoomHeader;
