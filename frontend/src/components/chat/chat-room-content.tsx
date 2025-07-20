import { useState } from "react";

import { type ChatRoom, type Message } from "@/types/chat/type";
import ChatMessageList from "@/components/chat/chat-message-list";
import ChatInput from "@/components/chat/chat-input";
import useModal from "@/hooks/common/use-modal";
import ChatMessageFileModal from "@/components/chat/chat-message-file-modal";
import { cn } from "@/utils/style";

interface ChatRoomContentProps {
  room: ChatRoom;
  messages: Message[];
  sendMessage: (_message: Message, _file?: File) => void;
  className?: string;
}

const ChatRoomContent = ({
  room,
  messages,
  sendMessage,
  className,
}: ChatRoomContentProps) => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const { isOpen, openModal, closeModal } = useModal({
    modalKey: "chat-message-detail",
  });

  const handleSelect = (message: Message) => {
    setSelectedMessage(message);

    if (message) {
      openModal();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      openModal();
    } else {
      closeModal();
    }
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <ChatMessageList
        messages={messages}
        roomMembers={room.roomMembers}
        onSelect={handleSelect}
        className="min-h-0 flex-1 overflow-y-auto p-6"
      />
      <ChatInput sendMessage={sendMessage} />
      <ChatMessageFileModal
        open={isOpen}
        onOpenChange={handleOpenChange}
        message={selectedMessage}
      />
    </div>
  );
};

export default ChatRoomContent;
