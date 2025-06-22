import { useQuery } from "@tanstack/react-query";

const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    staleTime: 24 * 60 * 1_000 * 60,
    gcTime: 24 * 60 * 1_000 * 60,
  });
};

export default useUser;
