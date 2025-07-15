import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteFriendRequest,
  postFriendRequest,
} from "@/services/community/api";
import type {
  FriendRequestRequest,
  FriendRequestType,
  FriendsResponse,
} from "@/types/community/type";
import useCurrentUser from "@/hooks/auth/use-current-user";

const useToggleFriendRequest = (
  userId: number,
  initState: FriendRequestType,
) => {
  const [optimisticState, setOptimisticState] = useState(initState);
  const { data } = useCurrentUser();
  const queryClient = useQueryClient();

  const requestMutation = useMutation({
    mutationKey: ["request-friend", userId],
    mutationFn: (request: FriendRequestRequest) => postFriendRequest(request),
    onMutate: () => {
      setOptimisticState("PENDING");
    },
    onError: () => {
      setOptimisticState(initState);
    },
  });

  const cancelMutation = useMutation({
    mutationKey: ["cancel-request-friend", userId],
    mutationFn: (userId: number) => deleteFriendRequest(userId),
    onMutate: () => {
      setOptimisticState("NONE");
    },
    onSuccess: (_, targetId) => {
      // 삭제 요청이 성공했다면, 해당 유저의 프로필을 리패칭 하여 최신화 한다.
      queryClient.invalidateQueries({ queryKey: ["profile", targetId] });
      queryClient.invalidateQueries({ queryKey: ["friends", targetId] });

      // 삭제 요청이 성공했다면, 사이드 바에서 해당 친구를 삭제한다.
      queryClient.setQueryData<FriendsResponse>(
        ["friends", Number(data?.userId)],
        (prev) => prev?.filter((item) => item.userId !== targetId) ?? [],
      );
    },
    onError: () => {
      setOptimisticState(initState);
    },
  });

  const toggleFriendRequest = () => {
    switch (optimisticState) {
      case "ACCEPTED":
      case "PENDING":
        cancelMutation.mutate(userId);
        break;
      case "NONE":
        requestMutation.mutate({ id: userId });
        break;
    }
  };

  return { optimisticState, toggleFriendRequest };
};

export default useToggleFriendRequest;
