import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  deleteFriendRequest,
  patchAcceptFriendRequest,
  postFriendRequest,
} from "@/services/community/api";
import type {
  RequestFriendRequest,
  FriendRequestsResponse,
  FriendRequestType,
  FriendsResponse,
  ProfileResponse,
  User,
} from "@/types/community/type";
import useCurrentUser from "@/hooks/auth/use-current-user";
import type { DamulError } from "@/types/common/type";
import { handleJsonResponse } from "@/utils/http-common";

const useHandleFriendRequest = (
  userId: number,
  initState: FriendRequestType,
) => {
  const [optimisticState, setOptimisticState] = useState(initState);
  const { data } = useCurrentUser();
  const queryClient = useQueryClient();

  // 친구 추가 요청
  const requestMutation = useMutation({
    mutationKey: ["request-friend", userId],
    mutationFn: async (request: RequestFriendRequest) => {
      const response = await postFriendRequest(request);
      if (!response.ok) {
        const errorBody = await response.json<DamulError>();
        throw new Error(errorBody.message);
      }
      return response;
    },
    onMutate: () => {
      setOptimisticState("PENDING_REQUEST");
      toast.success("친구 요청을 보냈어요");
    },
    onError: () => {
      setOptimisticState(initState);
      toast.error("친구 요청이 실패했어요");
    },
  });

  // 친구 추가 요청 취소, 친구 삭제
  const cancelMutation = useMutation({
    mutationKey: ["cancel-request-friend", userId],
    mutationFn: async (request: {
      userId: number;
      status: FriendRequestType;
    }) => {
      const response = await deleteFriendRequest(request.userId);
      if (!response.ok) {
        const errorBody = await response.json<DamulError>();
        throw new Error(errorBody.message);
      }
      return response;
    },
    onMutate: () => {
      setOptimisticState("NONE");
    },
    onSuccess: (_, request) => {
      switch (request.status) {
        case "ACCEPTED":
          {
            // 삭제 요청이 성공했다면, 해당 유저의 프로필을 무효화한다.
            queryClient.invalidateQueries({
              queryKey: ["profile", request.userId],
            });
            queryClient.invalidateQueries({
              queryKey: ["friends", request.userId],
            });

            // 삭제 요청이 성공했다면, 내 프로필의 친구수를 1 감소
            queryClient.setQueryData<ProfileResponse>(
              ["profile", data?.userId],
              (prev) =>
                prev
                  ? {
                      ...prev,
                      friendCount: prev.friendCount - 1,
                    }
                  : prev,
            );

            // 삭제 요청이 성공했다면, 사이드 바에서 해당 친구를 삭제한다.
            queryClient.setQueryData<FriendsResponse>(
              ["friends", data?.userId],
              (prev) =>
                prev?.filter((item) => item.userId !== request.userId) ?? [],
            );

            toast.success("친구를 삭제했어요");
          }
          break;
        case "PENDING_REQUEST":
          toast.success("친구 요청을 취소했어요");
          break;
      }
    },
    onError: () => {
      setOptimisticState(initState);
      toast.error("요청이 실패했어요");
    },
  });

  // 친구 요청 수락
  const acceptMutation = useMutation({
    mutationKey: ["accept-friend-request", userId],
    mutationFn: async (request: RequestFriendRequest) => {
      const response = await patchAcceptFriendRequest(request);
      return await handleJsonResponse<User>(response);
    },
    onMutate: () => {
      setOptimisticState("ACCEPTED");
    },
    onSuccess: (data) => {
      // 친구 요청 목록에서 수락한 친구를 제거
      queryClient.setQueryData<FriendRequestsResponse>(
        ["friend-requests"],
        (prev) => prev?.filter((item) => item.userId !== userId) ?? [],
      );

      // 해당 친구를 친구 목록에 추가
      queryClient.setQueryData<FriendsResponse>(
        ["friends", data?.userId],
        (prev) => (prev ? [...prev, data] : []),
      );

      // 내 프로필의 친구수를 1 증가
      queryClient.setQueryData<ProfileResponse>(
        ["profile", data?.userId],
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
        queryKey: ["friends", userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["profile", userId],
      });

      toast.success("새로운 친구를 추가했어요");
    },
    onError: () => {
      setOptimisticState(initState);
      toast.error("요청이 실패했어요");
    },
  });

  // 친구 요청 거절
  const rejectMutation = useMutation({
    mutationKey: ["reject-friend-request", userId],
    mutationFn: async (userId: number) => {
      const response = await deleteFriendRequest(userId);
      if (!response.ok) {
        const errorBody = await response.json<DamulError>();
        throw new Error(errorBody.message);
      }
      return response;
    },
    onMutate: () => {
      setOptimisticState("NONE");
    },
    onSuccess: () => {
      // 친구 요청 목록해서 해당 친구를 삭제
      queryClient.setQueryData<FriendRequestsResponse>(
        ["friend-requests"],
        (prev) => prev?.filter((user) => user.userId !== userId) ?? [],
      );

      // 해당 친구의 프로필과 친구 목록을 무효화
      queryClient.invalidateQueries({
        queryKey: ["profile", userId],
      });

      toast.success("친구 요청을 거절했어요");
    },
    onError: () => {
      setOptimisticState(initState);
      toast.error("요청이 실패했어요");
    },
  });

  return {
    optimisticState,
    requestFriend: () => requestMutation.mutate({ id: userId }),
    deleteFriend: () =>
      cancelMutation.mutate({ userId, status: optimisticState }),
    acceptFriend: () => acceptMutation.mutate({ id: userId }),
    rejectFriend: () => rejectMutation.mutate(userId),
  };
};

export default useHandleFriendRequest;
