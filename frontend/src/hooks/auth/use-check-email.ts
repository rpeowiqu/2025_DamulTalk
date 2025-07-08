import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  postCheckEmailDuplication,
  postReceiveCode,
} from "@/services/auth/api";
import type { CheckValueRequest } from "@/types/auth/type";

interface UseCheckEmailOptions {
  email: string;
  onSuccess?: () => void;
}

const useCheckEmail = ({ email, onSuccess }: UseCheckEmailOptions) => {
  const [messageType, setMessageType] = useState<"valid" | "invalid">("valid");
  const [message, setMessage] = useState("");

  const { mutate } = useMutation({
    mutationKey: ["check-email", email],
    mutationFn: async (request: CheckValueRequest) => {
      const response = await postCheckEmailDuplication(request);
      if (response.status === 204) {
        throw new Error("존재하지 않는 계정이에요");
      }
      return response;
    },
    onSuccess: () => {
      setMessageType("valid");
      setMessage("");
    },
    onError: (error) => {
      setMessageType("invalid");
      setMessage(error.message);
    },
  });

  const response = useMutation({
    mutationKey: ["receive-code", email],
    mutationFn: (email: string) => postReceiveCode({ email }),
    onSuccess,
    onError: () => {
      toast.error("인증코드를 보내지 못했어요");
    },
  });

  useEffect(() => {
    if (!email) {
      setMessageType("invalid");
      setMessage("");
      return;
    }

    mutate({ value: email });
  }, [email]);

  return { messageType, message, ...response };
};

export default useCheckEmail;
