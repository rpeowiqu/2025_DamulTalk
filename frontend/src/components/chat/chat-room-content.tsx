import { useState } from "react";

import { useScrollMove } from "@/hooks/chat/use-scroll-move";
import { type ChatMessageInfo } from "@/types/chat/type";
import ChatMessageList from "@/components/chat/chat-message-list";
import ChatInput from "@/components/chat/chat-input";
import ChatDummyData from "@/mocks/chat-messages.json";
import useModal from "@/hooks/common/use-modal";
import ChatMessageFileModal from "@/components/chat/chat-message-file-modal";

const ChatRoomContent = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessageInfo[]>(
    ChatDummyData as ChatMessageInfo[],
  );
  const [selectedMessage, setSelectedMessage] =
    useState<ChatMessageInfo | null>(null);
  const { bottomRef, triggerScroll } = useScrollMove();
  const { isOpen, openModal, closeModal } = useModal({
    modalKey: "chat-message-detail",
  });

  const handleSelect = (message: ChatMessageInfo) => {
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
    <div className="p-6 pb-0">
      <ChatMessageList
        chatMessages={chatMessages}
        bottomRef={bottomRef}
        onSelect={handleSelect}
      />
      <ChatInput
        setChatMessages={setChatMessages}
        triggerScroll={triggerScroll}
      />
      <ChatMessageFileModal
        open={isOpen}
        onOpenChange={handleOpenChange}
        messageInfo={selectedMessage}
      />
    </div>
  );
};

export default ChatRoomContent;
