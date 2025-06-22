import { useState } from "react";

import { useScrollMove } from "@/hooks/chat/useScrollMove";
import type { ChatMessageInfo } from "@/types/chat/type";
import ChatMessageList from "@/components/chat/chat-message-list";
import ChatInput from "@/components/chat/chat-input";
import ChatDummyData from "@/mocks/chat-messages.json";

const ChatRoomContent = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessageInfo[]>(
    ChatDummyData as ChatMessageInfo[],
  );
  const { bottomRef, triggerScroll } = useScrollMove();

  return (
    <div className="p-6 pb-0">
      <ChatMessageList chatMessages={chatMessages} bottomRef={bottomRef} />
      <ChatInput
        setChatMessages={setChatMessages}
        triggerScroll={triggerScroll}
      />
    </div>
  );
};

export default ChatRoomContent;
