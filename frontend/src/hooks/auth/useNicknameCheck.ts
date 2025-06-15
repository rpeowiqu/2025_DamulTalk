import { useEffect, useState } from "react";

const useNicknameCheck = (nickname: string) => {
  const [messageType, setMessageType] = useState<"valid" | "invalid">("valid");
  const [message, setMessage] = useState("");

  const checkValidity = (nickname: string) => {
    const regex = /^[A-Za-z0-9가-힣]{2,12}$/;
    if (regex.test(nickname)) {
      setMessageType("valid");
      setMessage("사용 가능한 닉네임이에요");
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

export default useNicknameCheck;
