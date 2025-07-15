import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import UserSearchButton from "@/components/community/user-search-button";
import FilterButton from "@/components/common/filter-button";
import SearchBar from "@/components/common/search-bar";
import FriendList from "@/components/community/friend-list";
import FriendRequestList from "@/components/community/friend-request-list";
import useFriendRequests from "@/hooks/community/use-friend-requests";
import useFriends from "@/hooks/community/use-friends";
import type { User } from "@/types/community/type";

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

interface SideBarFriendContentProps {
  user: User | undefined;
}

const SideBarFriendContent = ({ user }: SideBarFriendContentProps) => {
  const { data: friendRequests, isLoading: isLoadingFriendRequests } =
    useFriendRequests();
  const { data: friends, isLoading: isLoadingFriends } = useFriends(
    user?.userId ?? 0,
  );
  const [selectedFilter, setSelectedFilter] = useState("nickname-ascending");
  const navigate = useNavigate();

  const sortedFriends = friends
    ? [...friends].sort((a, b) => {
        switch (selectedFilter) {
          case "nickname-ascending":
            return a.nickname.localeCompare(b.nickname);
          case "nickname-descending":
            return b.nickname.localeCompare(a.nickname);
          default:
            return 0;
        }
      })
    : [];

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
        <AccordionItem value="friend-request" className="flex flex-col gap-4">
          <AccordionTrigger>
            친구 요청 {friendRequests?.length ?? 0}건
          </AccordionTrigger>
          <AccordionContent>
            <FriendRequestList
              isLoading={isLoadingFriendRequests}
              users={friendRequests ?? []}
              onSelect={(user) => navigate(`/profiles/${user.userId}`)}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="friends" className="flex flex-col gap-4">
          <AccordionTrigger>
            친구 {sortedFriends?.length ?? 0}명
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            <SearchBar onSearch={(keyword) => console.log(keyword)} />
            <FriendList
              isLoading={isLoadingFriends}
              users={sortedFriends ?? []}
              visibleStatus={true}
              onSelect={(user) => navigate(`/profiles/${user.userId}`)}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default SideBarFriendContent;
