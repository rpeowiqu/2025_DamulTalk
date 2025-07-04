import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import {
  deleteFriendRequest,
  postFriendRequest,
} from "@/services/community/api";
import type {
  FriendRequestRequest,
  FriendRequestType,
} from "@/types/community/type";

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
    mutationFn: (userId: number) => deleteFriendRequest(userId),
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
