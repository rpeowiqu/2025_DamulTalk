import { useQuery } from "@tanstack/react-query";

import { getFriends } from "@/services/community/api";

const useFriendList = () => {
  return useQuery({
    queryKey: ["friend-list"],
    queryFn: getFriends,
    staleTime: 30 * 1_000 * 60,
    gcTime: 30 * 10 * 1_000 * 60,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export default useFriendList;
