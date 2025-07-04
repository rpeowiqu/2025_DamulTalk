import { useQuery } from "@tanstack/react-query";

import { getFriends } from "@/services/community/api";
import type { FriendsResponse } from "@/types/community/type";

const useFriends = (userId: number) => {
  return useQuery({
    queryKey: ["friends", userId],
    queryFn: async ({ queryKey }) => {
      const [, userId] = queryKey;
      const response = await getFriends(Number(userId));
      // No content
      if (response.status === 204) {
        return [];
      }

      const data = await response.json<FriendsResponse>();
      return data;
    },
    staleTime: 30 * 1_000 * 60,
    gcTime: 30 * 1_000 * 60,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!userId,
  });
};

export default useFriends;
