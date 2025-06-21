import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import UserSearchButton from "@/components/user/user-search-button";
import FilterButton from "@/components/common/filter-button";
import SearchBar from "@/components/common/search-bar";
import FriendList from "@/components/user/friend-list";
import FriendRequestList from "@/components/user/friend-request-list";
import FriendRequestDummyData from "@/mocks/friend-request.json";
import FriendDummyData from "@/mocks/friends.json";
import type { UserInfo } from "@/types/user/type";

const friendFilters = [
  {
    label: "닉네임 오름차순",
    value: "nickname-ascending",
  },
  {
    label: "닉네임 내림차순",
    value: "nickname-descending",
  },
];

const SideBarFriendContent = () => {
  const [selectedFilter, setSelectedFilter] = useState("nickname-ascending");
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-end gap-4 text-neutral-500">
        <UserSearchButton />
        <FilterButton
          title="친구 목록 정렬 방식"
          filters={friendFilters}
          selected={selectedFilter}
          onSelect={setSelectedFilter}
        />
      </div>

      <Accordion
        type="multiple"
        defaultValue={["friends", "friend-request"]}
        className="scroll-hidden flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto">
        <AccordionItem value="friends" className="flex flex-col gap-4">
          <AccordionItem value="friend-request" className="flex flex-col gap-4">
            <AccordionTrigger>
              친구 요청 {FriendRequestDummyData.length}건
            </AccordionTrigger>
            <AccordionContent>
              <FriendRequestList
                userInfoList={FriendRequestDummyData}
                onSelect={(user: UserInfo) =>
                  navigate(`/profile/${user.userId}`)
                }
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionTrigger>친구 {FriendDummyData.length}명</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            <SearchBar onSearch={(keyword) => console.log(keyword)} />
            <FriendList
              userInfoList={FriendDummyData}
              visibleStatus={true}
              onSelect={(user: UserInfo) => navigate(`/profile/${user.userId}`)}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default SideBarFriendContent;
