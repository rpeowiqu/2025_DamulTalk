import { useQuery } from "@tanstack/react-query";

import { getFriendRequests } from "@/services/community/api";

const useFriendRequestList = () => {
  return useQuery({
    queryKey: ["friend-request-list"],
    queryFn: getFriendRequests,
    staleTime: 30 * 1_000 * 60,
    gcTime: 30 * 10 * 1_000 * 60,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export default useFriendRequestList;
