import { useState } from "react";

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
import type { ChatRoomPreview } from "@/types/chat/type";
import useEnterChatRoom from "@/hooks/chat/use-enter-chat-room";

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
  const [selectedChatRoomId, setSelectedChatRoomId] = useState(0);
  const { mutate: enterChatRoom } = useEnterChatRoom();

  const handleSelect = (room: ChatRoomPreview) => {
    setSelectedChatRoomId(room.roomId);
    enterChatRoom({
      roomId: room.roomId,
      lastReadAt: new Date().toISOString(),
    });
  };

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
          <AccordionTrigger>채팅 {data?.length ?? 0}건</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            <SearchBar onSearch={(keyword) => console.log(keyword)} />
            <ChatRoomList
              isLoading={isLoading}
              chatRoomPreviews={data ?? []}
              selecetedChatRoomId={selectedChatRoomId}
              onSelect={handleSelect}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default SideBarChatContent;
