import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { postEmailCheck } from "@/services/auth/api";

const useEmailCheck = (email: string) => {
  const [messageType, setMessageType] = useState<"valid" | "invalid">("valid");
  const [message, setMessage] = useState("");

  const { mutate } = useMutation({
    mutationFn: (email: string) => postEmailCheck({ value: email }),
    onSuccess: (response) => {
      switch (response.status) {
        case 200:
          setMessageType("invalid");
          setMessage("이미 사용 중인 이메일이에요");
          break;
        case 204:
          setMessageType("valid");
          setMessage("사용 가능한 이메일이에요");
          break;
      }
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

export default useEmailCheck;
