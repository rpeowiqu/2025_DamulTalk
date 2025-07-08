import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { postCheckEmailDuplication } from "@/services/auth/api";

const useCheckEmailDuplication = (email: string) => {
  const [messageType, setMessageType] = useState<"valid" | "invalid">("valid");
  const [message, setMessage] = useState("");

  const { mutate } = useMutation({
    mutationFn: async (email: string) => {
      const response = await postCheckEmailDuplication({ value: email });
      if (response.status === 200) {
        throw new Error("이미 사용 중인 이메일이에요");
      }
      return response;
    },
    onSuccess: () => {
      setMessageType("valid");
      setMessage("사용 가능한 이메일이에요");
    },
    onError: (error) => {
      setMessageType("invalid");
      setMessage(error.message);
    },
  });

  const checkValidity = (email: string) => {
    const regex = /^[A-Za-z0-9_.-]+@[A-Za-z0-9]+\.[A-Za-z0-9]+$/;
    if (regex.test(email)) {
      mutate(email);
    } else {
      setMessageType("invalid");
      setMessage("이메일 형식이 올바르지 않아요");
    }
  };

  useEffect(() => {
    if (email === "") {
      setMessageType("invalid");
      setMessage("");
      return;
    }

    checkValidity(email);
  }, [email]);

  return { messageType, message };
};

export default useCheckEmailDuplication;
