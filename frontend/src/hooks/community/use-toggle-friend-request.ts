import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import {
  deleteFriendRequest,
  postFriendRequest,
} from "@/services/community/api";
import type { FriendRequestRequest } from "@/types/community/type";
import type { FriendRequestType } from "@/types/user/type";

const useToggleFriendRequest = (
  userId: number,
  initState: FriendRequestType,
) => {
  const [optimisticState, setOptimisticState] = useState(initState);
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
    mutationFn: (request: FriendRequestRequest) => deleteFriendRequest(request),
    onMutate: () => {
      setOptimisticState("NONE");
    },
    onError: () => {
      setOptimisticState(initState);
    },
  });

  const toggleFriendRequest = () => {
    switch (optimisticState) {
      case "ACCEPTED":
      case "PENDING":
        cancelMutation.mutate({ id: userId });
        break;
      case "NONE":
        requestMutation.mutate({ id: userId });
        break;
    }
  };

  return { optimisticState, toggleFriendRequest };
};

export default useToggleFriendRequest;
