import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { postReadMessage } from "@/services/chat/api";
import type { ReadMessageRequest } from "@/types/chat/type";

const useEnterChatRoom = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["enter-chat-room"],
    mutationFn: (request: ReadMessageRequest) => postReadMessage(request),
    onSuccess: (_, request) => {
      navigate(`/chats/${request.roomId}`);
    },
  });
};

export default useEnterChatRoom;
