import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
      toast.success("친구 요청을 보냈어요");
    },
    onError: () => {
      setOptimisticState(initState);
      toast.error("친구 요청이 실패했어요");
    },
  });

  const cancelMutation = useMutation({
    mutationKey: ["cancel-request-friend", userId],
    mutationFn: (request: { userId: number; status: FriendRequestType }) =>
      deleteFriendRequest(request.userId),
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

            // 삭제 요청이 성공했다면, 내 프로필도 리패칭 하여 최신화 한다.
            queryClient.invalidateQueries({
              queryKey: ["friends", data?.userId],
            });

            // 삭제 요청이 성공했다면, 사이드 바에서 해당 친구를 삭제한다.
            queryClient.setQueryData<FriendsResponse>(
              ["friends", Number(data?.userId)],
              (prev) =>
                prev?.filter((item) => item.userId !== request.userId) ?? [],
            );

            toast.success("친구를 삭제했어요");
          }
          break;
        case "PENDING":
          toast.success("친구 요청을 취소했어요");
          break;
      }
    },
    onError: () => {
      console.log(optimisticState, "에서 ", initState, "로 setState");
      setOptimisticState(initState);
      toast.error("요청이 실패했어요");
    },
  });

  const toggleFriendRequest = () => {
    switch (optimisticState) {
      case "ACCEPTED":
      case "PENDING":
        cancelMutation.mutate({ userId, status: optimisticState });
        break;
      case "NONE":
        requestMutation.mutate({ id: userId });
        break;
    }
  };

  return { optimisticState, toggleFriendRequest };
};

export default useToggleFriendRequest;
