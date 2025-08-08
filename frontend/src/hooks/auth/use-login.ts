import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { postLogin } from "@/services/auth/api";
import type { LoginRequest, LoginResponse } from "@/types/auth/type";
import type { DamulError } from "@/types/common/type";

const useLogin = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const response = useMutation({
    mutationKey: ["login"],
    mutationFn: async (request: LoginRequest) => {
      const response = await postLogin(request);
      if (!response.ok) {
        const errorBody = await response.json<DamulError>();
        throw new Error(errorBody.message);
      }
      return response;
    },
    onSuccess: async (response) => {
      const accessToken = response.headers.get("Authorization");
      if (accessToken) {
        localStorage.setItem("access-token", accessToken);

        const data = await response.json<LoginResponse>();
        navigate(`/profiles/${data.userId}`, { replace: true });
      }
    },
    onError: (error) => {
      setMessage(error.message);
    },
  });

  return { message, ...response };
};

export default useLogin;
