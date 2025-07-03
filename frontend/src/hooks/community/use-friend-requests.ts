import { useQuery } from "@tanstack/react-query";

import { getFriendRequests } from "@/services/community/api";
import type { FriendRequestsResponse } from "@/types/community/type";

const useFriendRequests = () => {
  return useQuery({
    queryKey: ["friend-requests"],
    queryFn: async () => {
      const response = await getFriendRequests();
      // No content
      if (response.status === 204) {
        return [];
      }

      const data = await response.json<FriendRequestsResponse>();
      return data;
    },
    staleTime: 30 * 1_000 * 60,
    gcTime: 30 * 10 * 1_000 * 60,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};

export default useFriendRequests;
