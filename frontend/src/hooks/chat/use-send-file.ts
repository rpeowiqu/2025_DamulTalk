import { useMutation } from "@tanstack/react-query";

import { postSendFile } from "@/services/chat/api";
import type { SendFileRequest } from "@/types/chat/type";

const useSendFile = () => {
  return useMutation({
    mutationKey: ["send-file"],
    mutationFn: (request: SendFileRequest) => postSendFile(request),
  });
};

export default useSendFile;
