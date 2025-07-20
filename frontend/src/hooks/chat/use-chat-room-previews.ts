import { useQuery } from "@tanstack/react-query";

import { getChatRoomPreviews } from "@/services/chat/api";
import type { ChatRoomPreviewsResponse } from "@/types/chat/type";

const useChatRoomPreviews = () => {
  return useQuery({
    queryKey: ["chat-room-previews"],
    queryFn: async () => {
      const response = await getChatRoomPreviews();
      // No content
      if (response.status === 204) {
        return [];
      }

      const data = await response.json<ChatRoomPreviewsResponse>();
      return data;
    },
    staleTime: 30 * 60 * 1_000,
    gcTime: 30 * 60 * 1_000,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};

export default useChatRoomPreviews;
