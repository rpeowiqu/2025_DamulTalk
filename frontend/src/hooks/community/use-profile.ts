import { useQuery } from "@tanstack/react-query";

import { getProfile } from "@/services/community/api";
import { handleJsonResponse } from "@/utils/http-common";
import type { ProfileResponse } from "@/types/community/type";

const useProfile = (userId: number) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const response = await getProfile(Number(userId));
      return handleJsonResponse<ProfileResponse>(response);
    },
    staleTime: 5 * 1_000 * 60,
    gcTime: 3 * 1_000 * 60,
    refetchOnWindowFocus: false,
    retry: 0,
    enabled: !!userId,
  });
};

export default useProfile;
