import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { postFriendRequest } from "@/services/community/api";
import type { FriendRequestRequest } from "@/types/community/type";
import type { FriendRequestType } from "@/types/user/type";

const useRequestFriend = (userId: number, initState: FriendRequestType) => {
  const [optimisticState, setOptimisticState] = useState(initState);
  const response = useMutation({
    mutationKey: ["request-friend", userId],
    mutationFn: (request: FriendRequestRequest) => postFriendRequest(request),
    onMutate: () => {
      setOptimisticState((prev) => {
        switch (prev) {
          case "ACCEPTED":
          case "PENDING":
            return "NONE";
          case "NONE":
            return "PENDING";
        }
        return "NONE";
      });
    },
    onError: () => {
      setOptimisticState(initState);
    },
  });

  return { optimisticState, ...response };
};

export default useRequestFriend;
