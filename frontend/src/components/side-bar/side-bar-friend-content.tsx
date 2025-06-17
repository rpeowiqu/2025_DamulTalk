import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SearchBar from "@/components/common/search-bar";
import UserSearchIcon from "@/components/icon/user-search-icon";
import FilterIcon from "@/components/icon/filter-icon";
import FriendList from "@/components/user/friend-list";
import FriendRequestList from "@/components/user/friend-request-list";

const SideBarFriendContent = () => {
  return (
    <>
      <div className="flex justify-end gap-4 text-neutral-500">
        <UserSearchIcon />
        <FilterIcon />
      </div>

      <Accordion
        type="multiple"
        className="scroll-hidden flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto">
        <AccordionItem value="friends" className="flex flex-col gap-4">
          <AccordionTrigger>친구 8명</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            <SearchBar onSearch={(keyword) => console.log(keyword)} />
            <FriendList visibleStatus={true} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="friend-request" className="flex flex-col gap-4">
          <AccordionTrigger>친구 요청 2건</AccordionTrigger>
          <AccordionContent>
            <FriendRequestList />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default SideBarFriendContent;
