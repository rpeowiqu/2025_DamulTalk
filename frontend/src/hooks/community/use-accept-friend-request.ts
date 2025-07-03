import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postAcceptFriendRequest } from "@/services/community/api";
import type { FriendRequestsResponse } from "@/types/community/type";

const useAcceptFriendRequest = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["accept-friend-request", userId],
    mutationFn: (userId: number) => postAcceptFriendRequest(userId),
    onSuccess: () => {
      queryClient.setQueryData<FriendRequestsResponse>(
        ["friend-requests"],
        (prev) => prev?.filter((user) => user.userId !== userId) ?? [],
      );
      queryClient.invalidateQueries({
        queryKey: ["friend-requests"],
      });
    },
  });
};

export default useAcceptFriendRequest;
