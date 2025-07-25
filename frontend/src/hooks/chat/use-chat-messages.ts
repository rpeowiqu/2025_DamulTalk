import { useParams } from "react-router-dom";

import useInfiniteScroll from "@/hooks/common/use-infinite-scroll";
import { getMessages } from "@/services/chat/api";
import type { DamulError } from "@/types/common/type";
import type { MessagesResponse } from "@/types/chat/type";
import { handleJsonResponse } from "@/utils/http-common";

const useChatMessages = () => {
  const { roomId } = useParams();

  return useInfiniteScroll({
    queryKey: ["chat-messages", Number(roomId)],
    queryFn: async ({ pageParam }) => {
      const response = await getMessages({
        roomId: Number(roomId),
        cursor: typeof pageParam === "string" ? pageParam : undefined,
        size: pageParam ? 50 : undefined,
      });
      if (response.status === 204) {
        return {
          data: [],
          meta: {
            hasNext: false,
            nextCursor: "",
          },
        };
      } else if (!response.ok) {
        const errorBody = await response.json<DamulError>();
        throw new Error(errorBody.message);
      }

      return handleJsonResponse<MessagesResponse>(response);
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNext ? lastPage.meta.nextCursor : null,
    gcTime: 0,
    enabled: !!roomId,
    fetchDelay: 300,
  });
};

export default useChatMessages;
