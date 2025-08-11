import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import ChatMessage from "@/components/chat/chat-message";
import type { ChatRoomMember, Message } from "@/types/chat/type";
import { cn } from "@/utils/style";
import useChatMessages from "@/hooks/chat/use-chat-messages";
import useReadMessage from "@/hooks/chat/use-read-message";
import { useMoveScroll } from "@/hooks/chat/use-move-scroll";
import useCurrentUser from "@/hooks/auth/use-current-user";

interface ChatMessageListProps {
  messages: Message[];
  roomMembers: ChatRoomMember[];
  className?: string;
  onSelect?: (_message: Message) => void;
}

const ChatMessageList = ({
  messages,
  roomMembers,
  className,
  onSelect,
}: ChatMessageListProps) => {
  const { roomId } = useParams();
  const { data: user } = useCurrentUser();

  const { containerRef, targetRef, data } = useChatMessages(Number(roomId));
  const lastReadRef = useRef<HTMLDivElement>(null);
  const { bottomRef, triggerScroll } = useMoveScroll();

  const { mutate: readMessage } = useReadMessage(Number(roomId));
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const unreadCountMap = useMemo(() => {
    const result = new Map<string, number>();
    const sortedReatAts = roomMembers
      .map((item) => new Date(item.lastReadAt))
      .sort((a, b) => a.getTime() - b.getTime());
    const memberCount = roomMembers.length;

    let index = 0;
    let readAt = new Date(sortedReatAts[index]);

    data?.pages.forEach((page) =>
      page.data.forEach((item) => {
        const sentAt = new Date(item.sendTime);
        while (index < memberCount && sentAt >= readAt) {
          readAt = new Date(sortedReatAts[++index]);
        }
        result.set(item.messageId, index);
      }),
    );

    index = 0;
    readAt = new Date(sortedReatAts[index]);

    messages.forEach((item) => {
      const sentAt = new Date(item.sendTime);
      while (index < memberCount && sentAt >= readAt) {
        readAt = new Date(sortedReatAts[++index]);
      }
      result.set(item.messageId, index);
    });

    return result;
  }, [data, messages, roomMembers]);

  const lastReadMessageId = useMemo(() => {
    if (!data || !user) {
      return 0;
    }

    // 사용자가 마지막으로 읽은 바로 다음 메시지 아이디를 구한다.
    const lastReadAt =
      roomMembers.find((item) => item.userId === user?.userId)?.lastReadAt ??
      "";

    let prevMessageId = "";
    for (const page of data.pages) {
      for (const message of page.data) {
        if (new Date(message.sendTime) > new Date(lastReadAt)) {
          return prevMessageId;
        }
        prevMessageId = message.messageId;
      }
    }

    // 값을 찾기 못한 경우 마지막 메시지 아이디를 반환한다.
    return data.pages[0].data[data.pages[0].data.length - 1].messageId;
  }, [data?.pages[0].data?.[0]?.messageId, user]);

  useEffect(() => {
    if (!roomId || !data) {
      return;
    }

    // 최초로 이전 메시지를 가져올 때,
    if (data.pages.length === 1) {
      lastReadRef.current?.scrollIntoView({ behavior: "auto" });

      // 읽은 시간 갱신
      readMessage({
        roomId: Number(roomId),
        lastReadAt: new Date().toISOString(),
      });
    }
  }, [roomId, data?.pages.length]);

  // 메시지를 보낼 때, 바로 triggerScroll 함수를 호출하면 상태가 업데이트 되기 전에 먼저 동작하므로 useEffect를 활용
  useEffect(() => {
    if (!user || messages.length === 0) {
      return;
    }

    let timer: ReturnType<typeof setTimeout> | null = null;

    if (messages[messages.length - 1].senderId === user.userId) {
      triggerScroll();
    }
    // 스크롤바가 최하단에 있을 경우 새로운 메시지가 올 때 자동 스크롤
    else if (containerRef.current && lastReadRef.current) {
      const isBottom =
        containerRef.current.scrollHeight -
          (containerRef.current.scrollTop +
            containerRef.current.clientHeight) <=
        5 * lastReadRef.current.clientHeight;
      if (isBottom) {
        triggerScroll();
      }
      // 발신 메시지도 아니고, 스크롤바의 위치가 최하단도 아닐 경우 새 메시지 알림
      else if (!hasNewMessage) {
        setHasNewMessage(true);
        timer = setTimeout(() => setHasNewMessage(false), 3_000);
      }
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [messages.length, user?.userId]);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex flex-col gap-6", className)}>
      <div ref={targetRef} className="-mb-6" />

      <div className="flex flex-col-reverse gap-6">
        {data?.pages.map((page, index) => (
          <div key={index} className="flex flex-col gap-6">
            {page.data.map((item) => (
              <ChatMessage
                ref={
                  lastReadMessageId === item.messageId ? lastReadRef : undefined
                }
                key={item.messageId}
                message={{
                  ...item,
                  messageStatus: "SENT",
                  unReadCount: unreadCountMap.get(item.messageId) ?? 0,
                }}
                onClick={onSelect}
              />
            ))}
          </div>
        ))}
      </div>

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

      {hasNewMessage && (
        <p className="text-damul-main-400 sticky bottom-0 left-0 w-full rounded-xl bg-white/50 py-3 text-center font-bold">
          새로운 메시지가 있어요!
        </p>
      )}
    </div>
  );
};

export default ChatMessageList;
