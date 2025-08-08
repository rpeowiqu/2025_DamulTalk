import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { patchAcceptFriendRequest } from "@/services/community/api";
import type {
  RequestFriendRequest,
  FriendRequestsResponse,
  FriendsResponse,
  ProfileResponse,
  User,
} from "@/types/community/type";
import useCurrentUser from "@/hooks/auth/use-current-user";
import { handleJsonResponse } from "@/utils/http-common";

const useAcceptFriendRequest = (userId: number) => {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["accept-friend-request", userId],
    mutationFn: async (request: RequestFriendRequest) => {
      const response = await patchAcceptFriendRequest(request);
      return handleJsonResponse<User>(response);
    },
    onSuccess: (data) => {
      // 친구 요청 목록에서 수락한 친구를 제거
      queryClient.setQueryData<FriendRequestsResponse>(
        ["friend-requests"],
        (prev) => prev?.filter((item) => item.userId !== userId) ?? prev,
      );

      // 해당 친구를 친구 목록에 추가
      queryClient.setQueryData<FriendsResponse>(
        ["friends", user?.userId],
        (prev) => (prev ? [...prev, data] : []),
      );

      // 내 프로필의 친구수를 1 증가
      queryClient.setQueryData<ProfileResponse>(
        ["profile", user?.userId],
        (prev) =>
          prev
            ? {
                ...prev,
                friendCount: prev.friendCount + 1,
              }
            : prev,
      );

      // 해당 친구의 프로필과 친구 목록을 무효화
      queryClient.invalidateQueries({
        queryKey: ["friends", userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["profile", userId],
      });

      toast.success("새로운 친구를 추가했어요");
    },
  });
};

export default useAcceptFriendRequest;
