import { debounce } from "lodash-es";
import { useCallback, useEffect, useState } from "react";

const usePasswordCheck = (password: string, passwordCheck: string) => {
  const [messageType, setMessageType] = useState<"valid" | "invalid">("valid");
  const [message, setMessage] = useState("");

  const updateMessage = useCallback(
    debounce((newMessageType: "valid" | "invalid", newMessage: string) => {
      setMessageType(newMessageType);
      setMessage(newMessage);
    }, 300),
    [],
  );

  const checkValidity = (password: string, passwordCheck: string) => {
    if (password.length < 8) {
      updateMessage("invalid", "비밀번호는 8자 이상이어야 해요");
      return;
    }

    if (password !== passwordCheck) {
      updateMessage("invalid", "비밀번호가 일치하지 않아요");
      return;
    }

    updateMessage("valid", "사용 가능한 비밀번호에요");
  };

  useEffect(() => {
    if (password === "" || passwordCheck === "") {
      updateMessage("invalid", "");
      return;
    }

    checkValidity(password, passwordCheck);
  }, [password, passwordCheck]);

  return { messageType, message };
};

export default usePasswordCheck;
