import { useMutation } from "@tanstack/react-query";

import { postReadMessage } from "@/services/chat/api";
import type { ReadMessageRequest } from "@/types/chat/type";
import type { DamulError } from "@/types/common/type";

const useReadMessage = (roomId: number) => {
  return useMutation({
    mutationKey: ["read-message", roomId],
    mutationFn: async (request: ReadMessageRequest) => {
      const response = await postReadMessage(request);
      if (!response.ok) {
        const errorBody = await response.json<DamulError>();
        throw new Error(errorBody.message);
      }
      return response;
    },
  });
};

export default useReadMessage;
