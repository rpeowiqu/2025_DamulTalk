import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash-es";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ChatCreateButton from "@/components/chat/chat-create-button";
import FilterButton from "@/components/common/filter-button";
import SearchBar from "@/components/common/search-bar";
import ChatRoomList from "@/components/chat/chat-room-list";
import useChatRoomPreviews from "@/hooks/chat/use-chat-room-previews";
import type {
  ChatRoomPreview,
  ChatRoomPreviewsResponse,
} from "@/types/chat/type";

const chatFilters = [
  {
    label: "최신 메시지 순",
    value: "recent",
  },
  {
    label: "안 읽은 메시지 순",
    value: "unread",
  },
];

const SideBarChatContent = () => {
  const { data, isLoading } = useChatRoomPreviews();
  const [selectedFilter, setSelectedFilter] = useState("recent");
  const queryClient = useQueryClient();
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleChangeKeyword = debounce((keyword: string) => {
    setKeyword(keyword);
  }, 200);

  const handleSelect = (room: ChatRoomPreview) => {
    queryClient.setQueryData<ChatRoomPreviewsResponse>(
      ["chat-room-previews"],
      (prev) =>
        prev?.map((item) =>
          item.roomId === room.roomId
            ? {
                ...item,
                unReadMessageCount: 0,
              }
            : item,
        ) ?? prev,
    );
    navigate(`/chats/${room.roomId}`);
  };

  const sortedChatrooms = useMemo(
    () =>
      data
        ? data
            .filter((item) => item.roomName.includes(keyword))
            .sort((a, b) => {
              switch (selectedFilter) {
                case "recent":
                  return b.lastMessageTime.localeCompare(a.lastMessageTime);
                case "unread":
                  return a.unReadMessageCount < b.unReadMessageCount ? 1 : -1;
                default:
                  return 0;
              }
            })
        : [],
    [data, selectedFilter, keyword],
  );

  return (
    <>
      <div className="flex justify-end gap-4 text-neutral-500">
        <ChatCreateButton />
        <FilterButton
          title="채팅 목록 정렬 방식"
          filters={chatFilters}
          selected={selectedFilter}
          onSelect={setSelectedFilter}
        />
      </div>

      <Accordion
        type="multiple"
        defaultValue={["chats"]}
        className="scroll-hidden flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto">
        <AccordionItem value="chats" className="flex flex-col gap-4">
          <AccordionTrigger>
            채팅 {sortedChatrooms.length ?? 0}건
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            <SearchBar onChangeKeyword={handleChangeKeyword} />
            <ChatRoomList
              isLoading={isLoading}
              chatRoomPreviews={sortedChatrooms ?? []}
              onSelect={handleSelect}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default SideBarChatContent;
