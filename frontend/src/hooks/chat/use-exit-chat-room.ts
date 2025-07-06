import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { deleteExitChatRoom } from "@/services/chat/api";
import type { ChatRoomPreviewsResponse } from "@/types/chat/type";
import useCurrentUser from "@/hooks/auth/use-current-user";

const useExitChatRoom = (roomId: number) => {
  const queryClient = useQueryClient();
  const { data } = useCurrentUser();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["exit-chat-room", roomId],
    mutationFn: (roomId: number) => deleteExitChatRoom(roomId),
    onSuccess: (_, roomId) => {
      // 사이드 바의 채팅방 목록에서 방금 나간 채팅방을 제거하도록 캐시에 저장된 상태를 변경
      queryClient.setQueryData<ChatRoomPreviewsResponse>(
        ["chat-room-previews"],
        (prev) => prev?.filter((item) => item.roomId !== roomId) ?? [],
      );
      toast.success("해당 채팅방에서 빠져 나왔어요");

      // 유저의 프로필 페이지로 리다이렉트
      navigate(`/profiles/${data ? data.userId : 0}`, { replace: true });
    },
  });
};

export default useExitChatRoom;
