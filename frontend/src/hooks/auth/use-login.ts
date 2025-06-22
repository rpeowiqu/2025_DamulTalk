import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postLogin } from "@/services/auth/api";
import type { LoginRequest, LoginResponse } from "@/types/auth/type";

const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: (request: LoginRequest) => postLogin(request),
    onSuccess: async (response) => {
      const accessToken = response.headers.get("Authorization");
      if (accessToken) {
        localStorage.setItem("access-token", accessToken);

        const data: LoginResponse = await response.json();
        queryClient.setQueryData(["user"], {
          userId: data.userId,
          nickname: data.nickname,
        });
      }
    },
  });
};

export default useLogin;
