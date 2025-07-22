import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { postCreateChatRoom } from "@/services/chat/api";
import type { CreateChatRoomRequest } from "@/types/chat/type";
import type { DamulError } from "@/types/common/type";

const useCreateChatRoom = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["create-chat-room"],
    mutationFn: async (request: CreateChatRoomRequest) => {
      const response = await postCreateChatRoom(request);
      if (!response.ok) {
        const errorBody = await response.json<DamulError>();
        throw new Error(errorBody.message);
      }
      return response;
    },
    onSuccess: async (response) => {
      const data = await response.json<{ id: number }>();

      // success: 이미 동일한 멤버로 구성된 채팅방이 존재할 경우
      if (response.status === 200) {
        toast.error("이미 동일한 멤버로 구성된 채팅방이 있어요!");
      }
      // created: 새로운 채팅방을 만든 경우
      else if (response.status === 201) {
        // 사이드 바의 채팅 목록을 새롭게 불러온다.
        queryClient.refetchQueries({ queryKey: ["chat-room-previews"] });
        toast.success("채팅방을 만들었어요!");
      }

      // 해당 채팅방으로 이동
      navigate(`/chats/${data.id}`);
    },
  });
};

export default useCreateChatRoom;
