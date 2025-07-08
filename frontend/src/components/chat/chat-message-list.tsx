import { useRef, type Ref } from "react";

import ChatMessage from "@/components/chat/chat-message";
import type { Message } from "@/types/chat/type";
import { cn } from "@/utils/style";
import useChatMessages from "@/hooks/chat/use-chat-messages";

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
  const { targetRef, data } = useChatMessages();
  const lastReadRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div ref={targetRef} className="-mb-6" />
      {data?.pages.map((page) =>
        page.data.map((item) => (
          <ChatMessage key={item.messageId} message={item} />
        )),
      )}
      <div ref={lastReadRef} className="-my-6" />
      {chatMessages.map((item) => (
        <ChatMessage key={item.messageId} message={item} onClick={onSelect} />
      ))}
      <div ref={bottomRef} className="-mt-6" />
    </div>
  );
};

export default ChatMessageList;
