import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { postCheckNicknameDuplication } from "@/services/auth/api";

const useCheckNickname = (nickname: string) => {
  const [messageType, setMessageType] = useState<"valid" | "invalid">("valid");
  const [message, setMessage] = useState("");

  const { mutate } = useMutation({
    mutationFn: async (nickname: string) => {
      const response = await postCheckNicknameDuplication({ value: nickname });
      if (response.status === 200) {
        throw new Error("이미 사용 중인 닉네임이에요.");
      }
      return response;
    },
    onSuccess: () => {
      setMessageType("valid");
      setMessage("사용 가능한 닉네임이에요");
    },
    onError: (error) => {
      setMessageType("invalid");
      setMessage(error.message);
    },
  });

  const checkValidity = (nickname: string) => {
    const regex = /^[A-Za-z0-9가-힣]{2,12}$/;
    if (regex.test(nickname)) {
      mutate(nickname);
    } else {
      setMessageType("invalid");
      setMessage("닉네임은 한글, 영어, 숫자 2~12자리로 구성되어야 해요");
    }
  };

  useEffect(() => {
    if (nickname === "") {
      setMessageType("invalid");
      setMessage("");
      return;
    }

    checkValidity(nickname);
  }, [nickname]);

  return { messageType, message };
};

export default useCheckNickname;
