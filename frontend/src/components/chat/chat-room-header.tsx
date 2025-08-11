import type { ChatRoom } from "@/types/chat/type";
import ChatPortrait from "@/components/chat/chat-portrait";
import ChatRoomHeadCountButton from "@/components/chat/chat-room-head-count-button";
// import ChatRoomSearchButton from "@/components/chat/chat-room-search-button";
import ChatRoomExitButton from "@/components/chat/chat-room-exit-button";
import useCurrentUser from "@/hooks/auth/use-current-user";

interface ChatRoomHeaderProps {
  room: ChatRoom;
}

const ChatRoomHeader = ({ room }: ChatRoomHeaderProps) => {
  const { data } = useCurrentUser();

  return (
    <div className="flex items-center gap-6 border-b border-neutral-200 bg-white px-6 py-3 dark:border-neutral-500 dark:bg-neutral-800">
      <div className="flex flex-1 items-center gap-4">
        <ChatPortrait
          profileImageUrls={room.roomMembers
            .filter((item) => item.userId !== data?.userId)
            .slice(0, 4)
            .map((item) => item.profileImageUrl)}
        />
        <div className="flex flex-col break-all">
          <h1 className="line-clamp-1 text-lg font-bold">{room.roomName}</h1>
          <ChatRoomHeadCountButton room={room} />
        </div>
      </div>

      <div className="flex items-center gap-5 text-neutral-500 dark:text-white">
        {/* <ChatRoomSearchButton /> */}
        <ChatRoomExitButton room={room} />
      </div>
    </div>
  );
};

export default ChatRoomHeader;
