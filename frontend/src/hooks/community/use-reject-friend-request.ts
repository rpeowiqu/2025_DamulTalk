import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteFriendRequest } from "@/services/community/api";
import type { FriendRequestsResponse } from "@/types/community/type";
import type { DamulError } from "@/types/common/type";

const useRejectFriendRequest = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["reject-friend-request", userId],
    mutationFn: async (userId: number) => {
      const response = await deleteFriendRequest(userId);
      if (!response.ok) {
        const errorBody = await response.json<DamulError>();
        throw new Error(errorBody.message);
      }
      return response;
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
  });
};

export default useRejectFriendRequest;
