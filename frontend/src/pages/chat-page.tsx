import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { debounce } from "lodash-es";

import ChatRoomContent from "@/components/chat/chat-room-content";
import ChatRoomHeader from "@/components/chat/chat-room-header";
import FileUploadProvider from "@/contexts/chat/file-upload-provider";
import useChatRoom from "@/hooks/chat/use-chat-room";
import ChatRoomHeaderSkeleton from "@/components/chat/chat-room-header-skeleton";
import ChatRoomContentSkeleton from "@/components/chat/chat-room-content-skeleton";
import {
  WebSocketDispatchContext,
  WebSocketStateContext,
} from "@/contexts/chat/web-socket-provider";
import type {
  WsChatRoomReadResponse,
  WsMessageRequest,
  WsReadRequest,
  WsResponse,
} from "@/types/web-socket/type";
import type {
  ChatRoom,
  ChatRoomPreviewsResponse,
  Message,
  MessageTransferHistory,
} from "@/types/chat/type";
import useCurrentUser from "@/hooks/auth/use-current-user";
import useSendFile from "@/hooks/chat/use-send-file";

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const temporaryMessageSet = useRef<Map<string, MessageTransferHistory>>(
    new Map(),
  );

  const { roomId } = useParams();
  const { data, isLoading } = useChatRoom(Number(roomId));
  const { data: user } = useCurrentUser();

  const queryClient = useQueryClient();
  const socket = useContext(WebSocketStateContext);
  const { client, isConnected } = socket ?? {};
  const { publishMessage } = useContext(WebSocketDispatchContext)!;
  const { mutate: sendFile } = useSendFile();

  const readMessage = useMemo(
    () =>
      debounce(() => {
        publishMessage<WsReadRequest>("/pub/chats/read", {
          userId: user?.userId ?? 0,
          lastReadAt: new Date().toISOString(),
        });
      }, 1_000),
    [],
  );

  const sendMessage = async (message: Message, file?: File) => {
    if (!roomId) {
      return;
    }

    // 낙관적 업데이트로 즉시 상태에 추가하기
    setMessages((prev) => [...prev, message]);

    // 낙관적 업데이트에 추가한 메시지의 아이디와 보낸시각 저장하기
    temporaryMessageSet.current.set(message.clientId!, {
      objectUrl: message.fileUrl ?? undefined,
      sendTime: message.sendTime,
    });

    if (file) {
      // 파일 메시지일 경우 HTTP 통신으로 메시지 보내기
      await sendFile({
        roomId: Number(roomId),
        file,
        clientId: message.clientId!,
      });
    } else {
      // 텍스트 메시지일 경우 웹소켓으로 메시지 보내기
      publishMessage<WsMessageRequest>("/pub/chats/messages", {
        roomId: Number(roomId),
        senderId: message.senderId,
        messageType: "TEXT",
        content: message.content,
        clientId: message.clientId!,
      });
    }
  };

  useEffect(() => {
    if (!roomId || !client || !client.connected || !isConnected || !user) {
      return;
    }

    const subscription = client.subscribe(`/sub/chats/${roomId}`, (message) => {
      const response = JSON.parse(message.body) as WsResponse<any>;
      switch (response.type) {
        case "CHAT_MESSAGE":
          {
            const casted = response as WsResponse<Message>;

            // 내가 발신한 메시지를 수신한 경우
            if (casted.data.senderId === user.userId) {
              setMessages(
                (prev) =>
                  prev?.map((item) => {
                    if (item.clientId === casted.data.clientId) {
                      temporaryMessageSet.current.delete(casted.data.clientId!);
                      return {
                        ...item,
                        messageId: casted.data.messageId,
                        messageStatus: "SENT",
                        sendTime: casted.data.sendTime,
                        fileUrl: casted.data.fileUrl ?? "",
                      };
                    }
                    return item;
                  }) ?? [],
              );
            }
            // 다른 사람이 발신한 메시지를 수신한 경우
            else {
              // 수신한 메시지를 상태에 추가
              setMessages((prev) => (prev ? [...prev, casted.data] : []));
            }

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
                        unReadMessageCount:
                          item.roomId === Number(roomId)
                            ? 0
                            : item.unReadMessageCount + 1,
                      }
                    : item,
                ) ?? [],
            );

            // 웹 소켓으로 현재 시각까지 읽었음을 알림
            readMessage();
          }
          break;
        case "READ_TIME":
          {
            const casted = response as WsResponse<WsChatRoomReadResponse>;
            queryClient.setQueryData<ChatRoom>(["chat-room", roomId], (prev) =>
              prev
                ? {
                    ...prev,
                    roomMembers: prev.roomMembers.map((item) =>
                      item.userId === casted.data.userId
                        ? {
                            ...item,
                            lastReadAt: casted.data.lastReadAt,
                          }
                        : item,
                    ),
                  }
                : prev,
            );
          }
          break;
      }

      console.log("수신한 메시지", message.body);
    });
    console.log(`/sub/chats/${Number(roomId)} 구독을 시작합니다.`);

    return () => {
      subscription?.unsubscribe();
      console.log(`/sub/chats/${Number(roomId)} 구독을 종료합니다.`);
    };
  }, [roomId, client, isConnected, user]);

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
            <ChatRoomContent
              messages={messages}
              sendMessage={sendMessage}
              lastReadAts={
                data?.roomMembers.map((item) => item.lastReadAt) ?? []
              }
              className="min-h-0 flex-1"
            />
          </>
        ) : null}
      </div>
    </FileUploadProvider>
  );
};

export default ChatPage;
