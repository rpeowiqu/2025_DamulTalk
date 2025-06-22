import { useMutation } from "@tanstack/react-query";

import { postSignup } from "@/services/auth/api";
import type { SignupRequest } from "@/types/auth/type";

interface UseSignupOptions {
  onSuccess?: () => void;
}

const useSignup = ({ onSuccess }: UseSignupOptions) => {
  return useMutation({
    mutationKey: ["signup"],
    mutationFn: (request: SignupRequest) => postSignup(request),
    onSuccess: () => {
      onSuccess?.();
    },
    onError: () => {
      alert("잠시 후 다시 시도해 주세요");
    },
  });
};

export default useSignup;
