import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ChatRoomContent from "@/components/chat/chat-room-content";
import ChatRoomHeader from "@/components/chat/chat-room-header";
import FileUploadProvider from "@/contexts/chat/file-upload-provider";
import useChatRoom from "@/hooks/chat/use-chat-room";
import ChatRoomHeaderSkeleton from "@/components/chat/chat-room-header-skeleton";
import ChatRoomContentSkeleton from "@/components/chat/chat-room-content-skeleton";
import { WebSocketStateContext } from "@/contexts/chat/web-socket-provider";
import type { WsResponse } from "@/types/web-socket/type";
import type { Message } from "@/types/chat/type";

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { roomId } = useParams();
  const { data, isLoading } = useChatRoom(roomId ? Number(roomId) : 0);

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
            setMessages((prev) => (prev ? [...prev, casted.data] : []));
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
