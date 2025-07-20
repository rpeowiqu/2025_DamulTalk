import { useMutation } from "@tanstack/react-query";

import { postReadMessage } from "@/services/chat/api";
import type { ReadMessageRequest } from "@/types/chat/type";

const useReadMessage = (roomId: number) => {
  return useMutation({
    mutationKey: ["read-message", roomId],
    mutationFn: (request: ReadMessageRequest) => postReadMessage(request),
  });
};

export default useReadMessage;
