import { useEffect, useRef, type Ref } from "react";

import ChatMessage from "@/components/chat/chat-message";
import type { Message } from "@/types/chat/type";
import { cn } from "@/utils/style";
import useChatMessages from "@/hooks/chat/use-chat-messages";
import useReadMessage from "@/hooks/chat/use-read-message";
import { useParams } from "react-router-dom";

interface ChatMessageListProps {
  messages: Message[];
  bottomRef: Ref<HTMLDivElement>;
  className?: string;
  onSelect?: (_message: Message) => void;
}

const ChatMessageList = ({
  messages,
  bottomRef,
  className,
  onSelect,
}: ChatMessageListProps) => {
  const { targetRef, data, isSuccess } = useChatMessages();
  const lastReadRef = useRef<HTMLDivElement>(null);
  const initScrollRef = useRef(false);
  const { roomId } = useParams();
  const { mutate: readMessage } = useReadMessage();

  useEffect(() => {
    if (!data || !isSuccess || initScrollRef.current || !roomId) {
      return;
    }

    // 최초로 이전 메시지를 가져왔을 때
    if (data.pageParams.length === 1) {
      lastReadRef.current?.scrollIntoView({ behavior: "smooth" });
      // 읽음 시간 갱신
      readMessage({
        roomId: Number(roomId),
        lastReadAt: new Date().toISOString(),
      });
      initScrollRef.current = true;
    }
  }, [data, isSuccess]);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div ref={targetRef} className="-mb-6" />
      {data?.pages.map((page) =>
        page.data.map((item) => (
          <ChatMessage key={item.messageId} message={item} />
        )),
      )}
      <div ref={lastReadRef} className={cn(messages.length > 0 && "-mb-6")} />
      {messages.map((item) => (
        <ChatMessage key={item.messageId} message={item} onClick={onSelect} />
      ))}
      <div ref={bottomRef} className="-mt-6" />
    </div>
  );
};

export default ChatMessageList;
