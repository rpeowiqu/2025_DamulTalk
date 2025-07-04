import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postAcceptFriendRequest } from "@/services/community/api";
import type { FriendRequestsResponse, User } from "@/types/community/type";

const useAcceptFriendRequest = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["accept-friend-request", userId],
    mutationFn: (userId: number) => postAcceptFriendRequest(userId),
    onSuccess: () => {
      // 이전에 받은 친구 요청 리스트에 대한 데이터에서 현재 친구 요청을 제거한다.
      queryClient.setQueryData<FriendRequestsResponse>(
        ["friend-requests"],
        (prev) => prev?.filter((user) => user.userId !== userId) ?? [],
      );
      // // 이 데이터는 더이상 유효하지 않기 때문에 새로운 친구 요청이 올 때 리패칭 하도록 무효화 해주어야 한다.
      // queryClient.invalidateQueries({
      //   queryKey: ["friend-requests"],
      // });

      // 친구 목록을 다시 불러온다.
      const currentUser = queryClient.getQueryData<User>(["current-user"]);
      queryClient.refetchQueries({
        queryKey: ["friends", currentUser?.userId],
      });
    },
  });
};

export default useAcceptFriendRequest;
