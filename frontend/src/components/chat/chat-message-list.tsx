import { useEffect, useMemo, useRef, type Ref } from "react";
import { useParams } from "react-router-dom";

import ChatMessage from "@/components/chat/chat-message";
import type { Message } from "@/types/chat/type";
import { cn } from "@/utils/style";
import useChatMessages from "@/hooks/chat/use-chat-messages";
import useReadMessage from "@/hooks/chat/use-read-message";

interface ChatMessageListProps {
  messages: Message[];
  lastReadAts: string[];
  bottomRef: Ref<HTMLDivElement>;
  className?: string;
  onSelect?: (_message: Message) => void;
}

const ChatMessageList = ({
  messages,
  lastReadAts,
  bottomRef,
  className,
  onSelect,
}: ChatMessageListProps) => {
  const { targetRef, data, isSuccess } = useChatMessages();
  const lastReadRef = useRef<HTMLDivElement>(null);
  const initScrollRef = useRef(false);
  const { roomId } = useParams();
  const { mutate: readMessage } = useReadMessage();

  const unreadCountMap = useMemo(() => {
    const result = new Map<number, number>();

    data?.pages.forEach((page) =>
      page.data.forEach((message) => {
        let count = 0;
        lastReadAts.forEach((item) => {
          const readAt = new Date(item);
          const sentAt = new Date(message.sendTime);
          if (sentAt > readAt) {
            count++;
          }
        });
        result.set(message.messageId, count);
      }),
    );
    messages.forEach((message) => {
      let count = 0;
      lastReadAts.forEach((item) => {
        const readAt = new Date(item);
        const sentAt = new Date(message.sendTime);
        if (sentAt > readAt) {
          count++;
        }
      });
      result.set(message.messageId, count);
    });

    return result;
  }, [data, messages, lastReadAts]);

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
          <ChatMessage
            key={item.messageId}
            message={{
              ...item,
              unReadCount: unreadCountMap.get(item.messageId) ?? 0,
            }}
          />
        )),
      )}
      <div ref={lastReadRef} className={cn(messages.length > 0 && "-mb-6")} />
      {messages.map((item) => (
        <ChatMessage
          key={item.messageId}
          message={{
            ...item,
            unReadCount: unreadCountMap.get(item.messageId) ?? 0,
          }}
          onClick={onSelect}
        />
      ))}
      <div ref={bottomRef} className="-mt-6" />
    </div>
  );
};

export default ChatMessageList;
