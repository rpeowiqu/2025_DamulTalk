import { useMutation } from "@tanstack/react-query";

import { postSignup } from "@/services/auth/api";
import type { SignupRequest } from "@/types/auth/type";
import type { DamulError } from "@/types/common/type";

interface UseSignupOptions {
  onSuccess?: () => void;
}

const useSignup = ({ onSuccess }: UseSignupOptions) => {
  return useMutation({
    mutationKey: ["signup"],
    mutationFn: async (request: SignupRequest) => {
      const response = await postSignup(request);
      if (!response.ok) {
        const errorBody = await response.json<DamulError>();
        throw new Error(errorBody.message);
      }
      return response;
    },
    onSuccess: () => {
      onSuccess?.();
    },
    onError: () => {
      alert("잠시 후 다시 시도해 주세요");
    },
  });
};

export default useSignup;
