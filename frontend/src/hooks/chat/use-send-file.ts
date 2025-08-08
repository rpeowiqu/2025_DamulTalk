import { useMutation } from "@tanstack/react-query";

import { postSendFile } from "@/services/chat/api";
import type { SendFileRequest } from "@/types/chat/type";
import type { DamulError } from "@/types/common/type";

const useSendFile = () => {
  return useMutation({
    mutationKey: ["send-file"],
    mutationFn: async (request: SendFileRequest) => {
      const response = await postSendFile(request);
      if (!response.ok) {
        const errorBody = await response.json<DamulError>();
        throw new Error(errorBody.message);
      }
      return response;
    },
  });
};

export default useSendFile;
