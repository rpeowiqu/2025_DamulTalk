import { useMutation } from "@tanstack/react-query";

import { postReadMessage } from "@/services/chat/api";
import type { ReadMessageRequest } from "@/types/chat/type";

const useReadMessage = () => {
  return useMutation({
    mutationKey: ["enter-chat-room"],
    mutationFn: (request: ReadMessageRequest) => postReadMessage(request),
  });
};

export default useReadMessage;
