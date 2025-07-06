import { useQuery } from "@tanstack/react-query";

import { getChatRoom } from "@/services/chat/api";

const useChatRoom = (roomId: number) => {
  return useQuery({
    queryKey: ["chat-room", roomId],
    queryFn: () => getChatRoom(Number(roomId)),
    staleTime: 30 * 60 * 1_000,
    gcTime: 30 * 60 * 1_000,
    refetchOnWindowFocus: false,
    retry: 0,
    enabled: !!roomId,
  });
};

export default useChatRoom;
