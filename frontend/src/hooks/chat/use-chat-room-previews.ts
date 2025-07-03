import { useQuery } from "@tanstack/react-query";

import { getChatRoomPreviews } from "@/services/chat/api";

const useChatRoomPreviews = () => {
  return useQuery({
    queryKey: ["chat-room-previews"],
    queryFn: getChatRoomPreviews,
    staleTime: 30 * 60 * 1_000,
    gcTime: 30 * 60 * 1_000,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};

export default useChatRoomPreviews;
