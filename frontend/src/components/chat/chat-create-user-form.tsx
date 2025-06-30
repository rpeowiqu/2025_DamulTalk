import type { FormEvent } from "react";

import type { User } from "@/types/user/type";
import type { ChatCreateFormProps } from "@/components/chat/chat-create-form";
import Carousel from "@/components/common/carousel";
import Button from "@/components/common/button";
import ChatCreateUserItem from "@/components/chat/chat-create-user-item";
import SearchBar from "@/components/common/search-bar";
import FriendList from "@/components/user/friend-list";
import UserDummyData from "@/mocks/friends.json";

const ChatCreateUserForm = ({
  chatCreateInfo,
  setChatCreateInfo,
  onNext,
}: ChatCreateFormProps) => {
  const getDefaultTitle = (users: User[]): string => {
    const maxDisplay = 4;
    const nicknames = users.map((item) => item.nickname);
    nicknames.sort();
    if (nicknames.length <= maxDisplay) {
      return nicknames.join(", ");
    }

    const visible = nicknames.slice(0, maxDisplay).join(", ");
    const remaining = nicknames.length - maxDisplay;
    return `${visible} 외 ${remaining}명`;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 선택한 유저의 닉네임을 기반으로 title 값 설정
    const defaultTitle = getDefaultTitle(chatCreateInfo.selectedUsers);
    setChatCreateInfo((prev) => ({
      ...prev,
      title: defaultTitle,
    }));

    onNext?.();
  };

  const handleUserCreate = (user: User) => {
    setChatCreateInfo((prev) => {
      const isExist = prev.selectedUsers.some(
        (item) => item.userId === user.userId,
      );
      if (isExist) {
        return {
          ...prev,
          selectedUsers: prev.selectedUsers.filter(
            (item) => item.userId !== user.userId,
          ),
        };
      }
      return { ...prev, selectedUsers: [...prev.selectedUsers, user] };
    });
  };

  const handleUserDelete = (user: User) => {
    setChatCreateInfo((prev) => ({
      ...prev,
      selectedUsers: prev.selectedUsers.filter(
        (item) => item.userId !== user.userId,
      ),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col gap-4 pt-2">
      {chatCreateInfo.selectedUsers.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-end font-bold">
            총 {chatCreateInfo.selectedUsers.length}명
          </p>
          <Carousel>
            <div className="flex gap-3">
              {chatCreateInfo.selectedUsers.map((item) => (
                <ChatCreateUserItem
                  key={item.userId}
                  user={item}
                  onDelete={() => handleUserDelete(item)}
                />
              ))}
            </div>
          </Carousel>
        </div>
      )}
      <SearchBar onSearch={(keyword) => console.log(keyword)} />
      <FriendList
        users={UserDummyData}
        visibleStatus={false}
        className="scroll-hidden min-h-0 flex-1 overflow-y-auto"
        selectedUsers={chatCreateInfo.selectedUsers}
        onSelect={(user) => handleUserCreate(user)}
      />
      <Button
        className="w-full"
        disabled={chatCreateInfo.selectedUsers.length === 0}>
        다음
      </Button>
    </form>
  );
};

export default ChatCreateUserForm;
