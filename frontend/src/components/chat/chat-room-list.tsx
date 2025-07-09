import { useParams } from "react-router-dom";

import ChatRoomItem from "@/components/chat/chat-room-item";
import type { ChatRoomPreview } from "@/types/chat/type";
import ChatRoomItemSkeleton from "@/components/chat/chat-room-item-skeleton";

interface ChatRoomListProps {
  isLoading: boolean;
  chatRoomPreviews: ChatRoomPreview[];
  onSelect?: (_item: ChatRoomPreview) => void;
}

const ChatRoomList = ({
  isLoading,
  chatRoomPreviews,
  onSelect,
}: ChatRoomListProps) => {
  const { roomId } = useParams();

  return (
    <div className="flex flex-col gap-2">
      {isLoading
        ? Array.from({ length: 6 }).map((_, index) => (
            <ChatRoomItemSkeleton key={index} />
          ))
        : chatRoomPreviews.map((item) => (
            <ChatRoomItem
              key={item.roomId}
              chatRoomPreview={item}
              selected={item.roomId === Number(roomId)}
              onClick={() => onSelect?.(item)}
            />
          ))}
    </div>
  );
};

export default ChatRoomList;
