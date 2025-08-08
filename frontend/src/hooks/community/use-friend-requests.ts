import { useQuery } from "@tanstack/react-query";

import { getFriendRequests } from "@/services/community/api";
import type { FriendRequestsResponse } from "@/types/community/type";
import { handleJsonResponse } from "@/utils/http-common";

const useFriendRequests = () => {
  return useQuery({
    queryKey: ["friend-requests"],
    queryFn: async () => {
      const response = await getFriendRequests();
      // No content
      if (response.status === 204) {
        return [];
      }

      return await handleJsonResponse<FriendRequestsResponse>(response);
    },
    staleTime: 5 * 1_000 * 60,
    gcTime: 3 * 1_000 * 60,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};

export default useFriendRequests;
