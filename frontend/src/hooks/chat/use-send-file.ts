import { useMutation } from "@tanstack/react-query";
import type { KyResponse } from "ky";

import { postSendFile } from "@/services/chat/api";
import type { SendFileRequest } from "@/types/chat/type";

interface UseSendFileOptions {
  onSuccess?: (
    _data: KyResponse<unknown>,
    _variables: SendFileRequest,
    _context: unknown,
  ) => Promise<unknown> | unknown;
}

const useSendFile = ({ onSuccess }: UseSendFileOptions) => {
  return useMutation({
    mutationKey: ["send-file"],
    mutationFn: (request: SendFileRequest) => postSendFile(request),
    onSuccess,
  });
};

export default useSendFile;
