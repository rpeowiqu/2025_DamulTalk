import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import ChatRoomContent from "@/components/chat/chat-room-content";
import ChatRoomHeader from "@/components/chat/chat-room-header";
import FileUploadProvider from "@/contexts/chat/file-upload-provider";
import useChatRoom from "@/hooks/chat/use-chat-room";
import ChatRoomHeaderSkeleton from "@/components/chat/chat-room-header-skeleton";
import ChatRoomContentSkeleton from "@/components/chat/chat-room-content-skeleton";
import { WebSocketStateContext } from "@/contexts/chat/web-socket-provider";
import type { WsResponse } from "@/types/web-socket/type";
import type { ChatRoomPreviewsResponse, Message } from "@/types/chat/type";

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { roomId } = useParams();
  const { data, isLoading } = useChatRoom(roomId ? Number(roomId) : 0);
  const queryClient = useQueryClient();
  const socket = useContext(WebSocketStateContext);
  const { client, isConnected } = socket ?? {};

  useEffect(() => {
    if (!data || !client || !client.connected || !isConnected || !roomId) {
      return;
    }

    const subscription = client.subscribe(`/sub/chats/${roomId}`, (message) => {
      const response = JSON.parse(message.body) as WsResponse<any>;
      switch (response.type) {
        case "CHAT_MESSAGE":
          {
            const casted = response as WsResponse<Message>;
            // 수신한 메시지를 상태에 추가
            setMessages((prev) => (prev ? [...prev, casted.data] : []));

            // 사이드 바의 채팅방 목록 상태 갱신
            queryClient.setQueryData<ChatRoomPreviewsResponse>(
              ["chat-room-previews"],
              (prev) =>
                prev?.map((item) =>
                  item.roomId === Number(roomId)
                    ? {
                        ...item,
                        lastMessage: casted.data.content,
                        lastMessageTime: casted.data.sendTime,
                        unReadMessageCount: item.unReadMessageCount + 1,
                      }
                    : item,
                ) ?? [],
            );
          }
          break;
      }

      console.log("수신한 메시지", message.body);
    });
    console.log(`/sub/chats/${roomId} 구독을 시작합니다.`);

    return () => {
      subscription?.unsubscribe();
      console.log(`/sub/chats/${roomId} 구독을 종료합니다.`);
    };
  }, [data, client, isConnected]);

  return (
    <FileUploadProvider>
      <div className="flex h-full flex-col bg-neutral-50">
        {isLoading ? (
          <>
            <ChatRoomHeaderSkeleton />
            <ChatRoomContentSkeleton />
          </>
        ) : data ? (
          <>
            <ChatRoomHeader room={data} />
            <ChatRoomContent messages={messages} className="min-h-0 flex-1" />
          </>
        ) : null}
      </div>
    </FileUploadProvider>
  );
};

export default ChatPage;
