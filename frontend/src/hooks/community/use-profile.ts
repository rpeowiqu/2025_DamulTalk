import { useQuery } from "@tanstack/react-query";

import { getProfile } from "@/services/community/api";

const useProfile = (userId: number) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async ({ queryKey }) => {
      const [, userId] = queryKey;
      const data = await getProfile(Number(userId));
      return data;
    },
    staleTime: 30 * 1_000 * 60,
    gcTime: 30 * 1_000 * 60,
    refetchOnWindowFocus: false,
    retry: 0,
    enabled: !!userId,
  });
};

export default useProfile;
