import { useParams } from "react-router-dom";

import useInfiniteScroll from "@/hooks/common/use-infinite-scroll";
import { getMessages } from "@/services/chat/api";
import type { InfiniteScrollType } from "@/types/common/type";
import type { Message } from "@/types/chat/type";

const useChatMessages = () => {
  const { roomId } = useParams();

  return useInfiniteScroll({
    queryKey: ["chat-messages", roomId],
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
      }

      const data = await response.json<InfiniteScrollType<Message>>();
      return data;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNext ? lastPage.meta.nextCursor : null,
    enabled: !!roomId,
  });
};

export default useChatMessages;
