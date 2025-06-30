import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { User } from "@/types/user/type";
import UserSearchButton from "@/components/user/user-search-button";
import FilterButton from "@/components/common/filter-button";
import SearchBar from "@/components/common/search-bar";
import FriendList from "@/components/user/friend-list";
import FriendRequestList from "@/components/user/friend-request-list";
import useFriendRequestList from "@/hooks/community/use-friend-request-list";
import useFriendList from "@/hooks/community/use-friend-list";

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
  const { data: friendRequests, isLoading: isLoadingFriendRequests } =
    useFriendRequestList();
  const { data: friends, isLoading: isLoadingFriends } = useFriendList();
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
              친구 요청 {friendRequests?.length ?? 0}건
            </AccordionTrigger>
            <AccordionContent>
              <FriendRequestList
                isLoading={isLoadingFriendRequests}
                users={friendRequests ?? []}
                onSelect={(user: User) => navigate(`/profile/${user.userId}`)}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionTrigger>친구 {friends?.length ?? 0}명</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            <SearchBar onSearch={(keyword) => console.log(keyword)} />
            <FriendList
              isLoading={isLoadingFriends}
              users={friends ?? []}
              visibleStatus={true}
              onSelect={(user: User) => navigate(`/profile/${user.userId}`)}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default SideBarFriendContent;
