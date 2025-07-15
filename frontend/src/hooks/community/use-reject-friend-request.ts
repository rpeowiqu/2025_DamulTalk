import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteFriendRequest } from "@/services/community/api";
import type { FriendRequestsResponse } from "@/types/community/type";

const useRejectFriendRequest = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["reject-friend-request", userId],
    mutationFn: (userId: number) => deleteFriendRequest(userId),
    onSuccess: () => {
      queryClient.setQueryData<FriendRequestsResponse>(
        ["friend-requests"],
        (prev) => prev?.filter((user) => user.userId !== userId) ?? [],
      );
      toast.success("친구 요청을 거절했어요");
    },
  });
};

export default useRejectFriendRequest;
