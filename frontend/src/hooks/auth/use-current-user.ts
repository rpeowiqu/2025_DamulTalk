import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/services/auth/api";
import { handleJsonResponse } from "@/utils/http-common";
import type { User } from "@/types/community/type";

const useCurrentUser = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await getCurrentUser();
      return await handleJsonResponse<User>(response);
    },
    staleTime: 60 * 1_000 * 60,
    gcTime: 60 * 1_000 * 60,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};

export default useCurrentUser;
