import type { Ref } from "react";

import ChatMessage from "@/components/chat/chat-message";
import type { ChatMessageInfo } from "@/types/chat/type";
import { cn } from "@/utils/style";

interface ChatMessageListProps {
  chatMessages: ChatMessageInfo[];
  bottomRef: Ref<HTMLDivElement>;
  className?: string;
}

const ChatMessageList = ({
  chatMessages,
  bottomRef,
  className,
}: ChatMessageListProps) => {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {chatMessages.map((item) => (
        <ChatMessage key={item.messageId} messageInfo={item} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessageList;
