import ChatRoomItem from "@/components/chat/chat-room-item";
import type { ChatRoomPreview } from "@/types/chat/type";

interface ChatRoomListProps {
  isLoading: boolean;
  chatRoomPreviews: ChatRoomPreview[];
  selecetedChatRoomId: number;
  onSelect?: (_item: ChatRoomPreview) => void;
}

const ChatRoomList = ({
  isLoading,
  chatRoomPreviews,
  selecetedChatRoomId,
  onSelect,
}: ChatRoomListProps) => {
  return (
    <div className="flex flex-col gap-2">
      {chatRoomPreviews.map((item) => (
        <ChatRoomItem
          key={item.roomId}
          chatRoomPreview={item}
          selected={item.roomId === selecetedChatRoomId}
          onClick={() => onSelect?.(item)}
        />
      ))}
    </div>
  );
};

export default ChatRoomList;
