import { useQuery } from "@tanstack/react-query";

import { getChatRoom } from "@/services/chat/api";
import { handleJsonResponse } from "@/utils/http-common";
import type { ChatRoomResponse } from "@/types/chat/type";

const useChatRoom = (roomId: number) => {
  return useQuery({
    queryKey: ["chat-room", roomId],
    queryFn: async () => {
      const response = await getChatRoom(Number(roomId));
      return await handleJsonResponse<ChatRoomResponse>(response);
    },
    staleTime: 10 * 1_000 * 60,
    gcTime: 3 * 1_000 * 60,
    refetchOnWindowFocus: false,
    retry: 0,
    enabled: !!roomId,
  });
};

export default useChatRoom;
