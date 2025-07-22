import { useQuery } from "@tanstack/react-query";

import { getChatRoomPreviews } from "@/services/chat/api";
import type { ChatRoomPreviewsResponse } from "@/types/chat/type";
import { handleJsonResponse } from "@/utils/http-common";

const useChatRoomPreviews = () => {
  return useQuery({
    queryKey: ["chat-room-previews"],
    queryFn: async () => {
      const response = await getChatRoomPreviews();
      // No content
      if (response.status === 204) {
        return [];
      }

      return await handleJsonResponse<ChatRoomPreviewsResponse>(response);
    },
    staleTime: 5 * 1_000 * 60,
    gcTime: 3 * 1_000 * 60,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};

export default useChatRoomPreviews;
