import { useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
  ProfileResponse,
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
    if (!data || !client || !client.connected || !isConnected) {
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

              // 새로 초대된 채팅방일 경우 채팅 목록을 다시 불러온다.
              let isFetched = false;

              queryClient.setQueryData<ChatRoomPreviewsResponse>(
                ["chat-room-previews"],
                (prev) =>
                  prev
                    ? prev.map((item) => {
                        if (item.roomId === casted.data.roomId) {
                          isFetched = true;

                          return {
                            ...item,
                            lastMessage: casted.data.content,
                            lastMessageTime: casted.data.sendTime,
                            unReadMessageCount:
                              item.roomId === roomIdRef.current
                                ? 0
                                : item.unReadMessageCount + 1,
                          };
                        }

                        return item;
                      })
                    : [],
              );

              if (!isFetched) {
                queryClient.invalidateQueries({
                  queryKey: ["chat-room-previews"],
                });
              }
            }
            break;
          case "FRIEND_REQUEST":
            {
              const casted = response as WsResponse<User>;
              queryClient.setQueryData<FriendRequestsResponse>(
                ["friend-requests"],
                (prev) => (prev ? [...prev, casted.data] : []),
              );

              toast.success(`${casted.data.nickname}님이 친구 요청을 보냈어요`);
            }
            break;
          case "FRIEND_REQUEST_CANCEL":
            {
              const casted = response as WsResponse<{ userId: number }>;

              // 수신한 유저를 친구 요청 목록에서 제거
              queryClient.setQueryData<FriendRequestsResponse>(
                ["friend-requests"],
                (prev) =>
                  prev?.filter((item) => item.userId !== casted.data.userId) ??
                  [],
              );

              console.log(casted.data.userId);
              // 수신한 유저의 프로필 무효화
              queryClient.invalidateQueries({
                queryKey: ["profile", casted.data.userId],
              });
            }
            break;
          case "FRIEND_ACCEPT":
            {
              const casted = response as WsResponse<User>;

              // 수신한 유저를 친구 목록에 추가
              queryClient.setQueryData<FriendsResponse>(
                ["friends", data.userId],
                (prev) => (prev ? [...prev, casted.data] : []),
              );

              // 내 프로필의 친구수를 1 증가
              queryClient.setQueryData<ProfileResponse>(
                ["profile", data.userId],
                (prev) =>
                  prev
                    ? {
                        ...prev,
                        friendCount: prev.friendCount + 1,
                      }
                    : prev,
              );

              // 수신한 유저의 프로필과 친구 목록을 무효화
              queryClient.invalidateQueries({
                queryKey: ["friends", casted.data.userId],
              });
              queryClient.invalidateQueries({
                queryKey: ["profile", casted.data.userId],
              });

              toast.success(
                `${casted.data.nickname}님이 친구 요청을 수락했어요`,
              );
            }
            break;
          case "FRIEND_DELETE":
            {
              const casted = response as WsResponse<{ userId: number }>;

              // 수신한 유저를 친구 목록에서 제거
              queryClient.setQueryData<FriendsResponse>(
                ["friends", data.userId],
                (prev) =>
                  prev?.filter((item) => item.userId !== casted.data.userId) ??
                  [],
              );

              // 내 프로필의 친구수를 1 감소
              queryClient.setQueryData<ProfileResponse>(
                ["profile", data.userId],
                (prev) =>
                  prev
                    ? {
                        ...prev,
                        friendCount: prev.friendCount - 1,
                      }
                    : prev,
              );

              // 수신한 유저의 프로필과 친구 목록을 무효화
              queryClient.invalidateQueries({
                queryKey: ["friends", casted.data.userId],
              });
              queryClient.invalidateQueries({
                queryKey: ["profile", casted.data.userId],
              });
            }
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
