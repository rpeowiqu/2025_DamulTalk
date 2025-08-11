import { useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlignJustifyIcon } from "lucide-react";

import SideBarTab from "@/components/side-bar/side-bar-tab";
import SideBarContent from "@/components/side-bar/side-bar-content";
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
import useSideBarTabStore from "@/store/side-bar-tab-store";
import { cn } from "@/utils/style";
import SideBarOverlay from "@/components/side-bar/side-bar-overlay";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
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
        // 새로고침시 초기화 문제와 subscription에서 클로저 문제가 발생하기 때문에 Zustand를 사용하여 전역 상태로 관리!
        const { currentTab, setTabNotifications } =
          useSideBarTabStore.getState();

        const response = JSON.parse(message.body) as WsResponse<unknown>;
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
                    : prev,
              );

              if (!isFetched) {
                queryClient.invalidateQueries({
                  queryKey: ["chat-room-previews"],
                });
              }

              if (currentTab !== "CHAT") {
                setTabNotifications("CHAT", true);
              }
            }
            break;
          case "FRIEND_REQUEST":
            {
              const casted = response as WsResponse<User>;
              queryClient.setQueryData<FriendRequestsResponse>(
                ["friend-requests"],
                (prev) => (prev ? [...prev, casted.data] : prev),
              );

              // 수신한 유저의 프로필 무효화
              queryClient.invalidateQueries({
                queryKey: ["profile", casted.data.userId],
              });

              toast.success(`${casted.data.nickname}님이 친구 요청을 보냈어요`);
              if (currentTab !== "FRIEND") {
                setTabNotifications("FRIEND", true);
              }
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
                  prev,
              );

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
                (prev) => (prev ? [...prev, casted.data] : prev),
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
              if (currentTab !== "FRIEND") {
                setTabNotifications("FRIEND", true);
              }
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
                  prev,
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
                  ) ?? prev,
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
    <>
      <div className="flex h-16 items-center gap-4 border-b border-neutral-200 bg-white px-4 xl:hidden dark:border-neutral-500 dark:bg-neutral-800">
        <button onClick={() => setIsOpen(true)} className="cursor-pointer">
          <AlignJustifyIcon />
        </button>

        <h1 className="text-damul-main-300 text-2xl font-extrabold select-none">
          DamulTalk
        </h1>
      </div>

      {isOpen && <SideBarOverlay setIsOpen={setIsOpen} />}

      <div
        className={cn(
          "xl:trnsform-none fixed top-0 left-0 z-40 flex h-dvh max-w-80 min-w-80 border-r border-neutral-200 transition-transform duration-500 ease-in-out xl:sticky xl:translate-x-0 dark:border-neutral-500",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}>
        <SideBarTab />
        <SideBarContent setIsOpen={setIsOpen} />
      </div>
    </>
  );
};

export default SideBar;
