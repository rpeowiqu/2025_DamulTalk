import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteFriendRequest } from "@/services/community/api";
import type {
  FriendRequestRequest,
  FriendRequestsResponse,
} from "@/types/community/type";

const useRejectFriendRequest = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["reject-friend-request", userId],
    mutationFn: (request: FriendRequestRequest) => deleteFriendRequest(request),
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

export default useRejectFriendRequest;
