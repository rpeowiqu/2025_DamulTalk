import { useState } from "react";

import { useMoveScroll } from "@/hooks/chat/use-move-scroll";
import { type Message } from "@/types/chat/type";
import ChatMessageList from "@/components/chat/chat-message-list";
import ChatInput from "@/components/chat/chat-input";
import useModal from "@/hooks/common/use-modal";
import ChatMessageFileModal from "@/components/chat/chat-message-file-modal";
import { cn } from "@/utils/style";

interface ChatRoomContentProps {
  messages: Message[];
  lastReadAts: string[];
  className?: string;
}

const ChatRoomContent = ({
  messages,
  lastReadAts,
  className,
}: ChatRoomContentProps) => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const { bottomRef, triggerScroll } = useMoveScroll();
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
      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        <ChatMessageList
          messages={messages}
          lastReadAts={lastReadAts}
          bottomRef={bottomRef}
          onSelect={handleSelect}
        />
      </div>
      <ChatInput triggerScroll={triggerScroll} />
      <ChatMessageFileModal
        open={isOpen}
        onOpenChange={handleOpenChange}
        message={selectedMessage}
      />
    </div>
  );
};

export default ChatRoomContent;
