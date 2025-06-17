import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SearchBar from "@/components/common/search-bar";
import ChatCreateIcon from "@/components/icon/chat-create-icon";
import FilterIcon from "@/components/icon/filter-icon";
import ChatRoomList from "@/components/chat/chat-room-list";

const SideBarChatContent = () => {
  return (
    <>
      <div className="flex justify-end gap-4 text-neutral-500">
        <ChatCreateIcon />
        <FilterIcon />
      </div>

      <Accordion
        type="multiple"
        className="scroll-hidden flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto">
        <AccordionItem value="friends" className="flex flex-col gap-4">
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
