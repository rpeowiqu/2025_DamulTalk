import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/services/auth/api";

const useCurrentUser = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    staleTime: 30 * 60 * 1_000,
    gcTime: 30 * 60 * 1_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export default useCurrentUser;
