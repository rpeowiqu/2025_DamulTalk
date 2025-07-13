import { useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import SideBarTab from "@/components/side-bar/side-bar-tab";
import SideBarContent from "@/components/side-bar/side-bar-content";
import { type SideBarTabType } from "@/types/side-bar/type";
import { WebSocketStateContext } from "@/contexts/chat/web-socket-provider";
import useCurrentUser from "@/hooks/auth/use-current-user";
import type {
  UserStatus,
  WsChatRoomPreviewResponse,
  WsResponse,
} from "@/types/web-socket/type";
import type {
  FriendRequestsResponse,
  FriendsResponse,
  User,
} from "@/types/community/type";
import type { ChatRoomPreviewsResponse } from "@/types/chat/type";
import useRoomId from "@/hooks/chat/use-room-id";

const SideBar = () => {
  const [currentTab, setCurrentTab] = useState<SideBarTabType>("FRIEND");

  const { data } = useCurrentUser();
  const roomIdRef = useRoomId();

  const socket = useContext(WebSocketStateContext);
  const { client, isConnected } = socket ?? {};
  const queryClient = useQueryClient();

  useEffect(() => {
    if (
      !data ||
      !client ||
      !client.connected ||
      !isConnected ||
      !roomIdRef.current
    ) {
      return;
    }

    const subscription = client.subscribe(
      `/sub/notifications/${data.userId}`,
      (message) => {
        const response = JSON.parse(message.body) as WsResponse<any>;
        switch (response.type) {
          case "CHAT_NOTI":
            {
              const casted = response as WsResponse<WsChatRoomPreviewResponse>;
              queryClient.setQueryData<ChatRoomPreviewsResponse>(
                ["chat-room-previews"],
                (prev) =>
                  prev?.map((item) =>
                    item.roomId === casted.data.roomId
                      ? {
                          ...item,
                          lastMessage: casted.data.content,
                          lastMessageTime: casted.data.sendTime,
                          unReadMessageCount:
                            item.roomId === roomIdRef.current
                              ? 0
                              : item.unReadMessageCount + 1,
                        }
                      : item,
                  ) ?? [],
              );
            }
            break;
          case "FRIEND_REQUEST":
            {
              const casted = response as WsResponse<User>;
              queryClient.setQueryData<FriendRequestsResponse>(
                ["friend-requests"],
                (prev) => (prev ? [...prev, casted.data] : []),
              );
            }
            break;
          case "FRIEND_REQUEST_CANCEL":
            {
              const casted = response as WsResponse<{ userId: number }>;
              queryClient.setQueryData<FriendRequestsResponse>(
                ["friend-requests"],
                (prev) =>
                  prev?.filter((item) => item.userId !== casted.data.userId) ??
                  [],
              );
            }
            break;
          case "FRIEND_ACCEPT":
            break;
          case "FRIEND_DELETE":
            break;
          case "ONLINE_STATUS":
            {
              const casted = response as WsResponse<UserStatus>;
              queryClient.setQueryData<FriendsResponse>(
                ["friends", data.userId],
                (prev) =>
                  prev?.map((item) =>
                    item.userId === casted.data.userId
                      ? {
                          ...item,
                          online: casted.data.online,
                        }
                      : item,
                  ) ?? [],
              );
            }
            break;
        }

        console.log("수신한 메시지", message.body);
      },
    );
    console.log(`/sub/notifications/${data.userId} 구독을 시작합니다.`);

    return () => {
      subscription?.unsubscribe();
      console.log(`/sub/notifications/${data.userId} 구독을 종료합니다.`);
    };
  }, [data, client, isConnected]);

  return (
    <aside className="sticky top-0 flex h-dvh border-r border-neutral-200">
      <SideBarTab currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <SideBarContent currentTab={currentTab} />
    </aside>
  );
};

export default SideBar;
