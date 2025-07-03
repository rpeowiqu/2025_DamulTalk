import type { Ref } from "react";

import ChatMessage from "@/components/chat/chat-message";
import type { Message } from "@/types/chat/type";
import { cn } from "@/utils/style";

interface ChatMessageListProps {
  chatMessages: Message[];
  bottomRef: Ref<HTMLDivElement>;
  className?: string;
  onSelect?: (_message: Message) => void;
}

const ChatMessageList = ({
  chatMessages,
  bottomRef,
  className,
  onSelect,
}: ChatMessageListProps) => {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {chatMessages.map((item) => (
        <ChatMessage key={item.messageId} message={item} onClick={onSelect} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessageList;
