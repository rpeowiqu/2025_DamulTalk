import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { postLogin } from "@/services/auth/api";
import type { LoginRequest, LoginResponse } from "@/types/auth/type";

const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: (request: LoginRequest) => postLogin(request),
    onSuccess: async (response) => {
      const accessToken = response.headers.get("Authorization");
      if (accessToken) {
        localStorage.setItem("access-token", accessToken);

        const data: LoginResponse = await response.json();
        navigate(`/profiles/${data.userId}`, { replace: true });
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export default useLogin;
