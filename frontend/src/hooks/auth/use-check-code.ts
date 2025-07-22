import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import type { CheckCodeReqeust } from "@/types/auth/type";
import { postCheckCode } from "@/services/auth/api";
import type { DamulError } from "@/types/common/type";

const useCheckCode = (email: string, code: string) => {
  const [messageType, setMessageType] = useState<"valid" | "invalid">("valid");
  const [message, setMessage] = useState("");

  const { mutate } = useMutation({
    mutationKey: ["check-code", email, code],
    mutationFn: async (request: CheckCodeReqeust) => {
      const response = await postCheckCode(request);
      if (!response.ok) {
        const errorBody = await response.json<DamulError>();
        throw new Error(errorBody.message);
      }
      return response;
    },
    onSuccess: () => {
      setMessageType("valid");
      setMessage("인증코드가 일치해요");
    },
    onError: () => {
      setMessageType("invalid");
      setMessage("인증코드가 일치하지 않아요");
    },
  });

  useEffect(() => {
    if (!code) {
      setMessageType("invalid");
      setMessage("");
      return;
    }

    mutate({ email, code });
  }, [code]);

  return { messageType, message };
};

export default useCheckCode;
