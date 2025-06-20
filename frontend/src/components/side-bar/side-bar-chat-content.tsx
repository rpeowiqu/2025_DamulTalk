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
  const [selectedFilter, setSelectedFilter] = useState("recent");

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
          <AccordionTrigger>채팅 4건</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            <SearchBar onSearch={(keyword) => console.log(keyword)} />
            <ChatRoomList />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default SideBarChatContent;
