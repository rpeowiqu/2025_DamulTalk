import type { ButtonHTMLAttributes } from "react";

import type { ChatRoom } from "@/types/chat/type";
import UserIcon from "@/components/icon/user-icon";
import ChatRoomMemberModal from "@/components/chat/chat-room-member-modal";
import useModal from "@/hooks/common/use-modal";

interface ChatRoomHeadCountButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  room: ChatRoom;
}

const ChatRoomHeadCountButton = ({
  room,
  ...props
}: ChatRoomHeadCountButtonProps) => {
  const { isOpen, openModal, closeModal } = useModal({
    modalKey: "chat-room-members",
  });

  const handleClick = () => {
    openModal();
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      openModal();
    } else {
      closeModal();
    }
  };

  return (
    <>
      <button
        className="flex cursor-pointer items-center gap-1 text-neutral-500 dark:text-neutral-200"
        {...props}
        onClick={handleClick}>
        <UserIcon className="size-4" />
        <p>{room.roomSize}</p>
      </button>

      <ChatRoomMemberModal
        open={isOpen}
        onOpenChange={handleOpenChange}
        members={room.roomMembers}
      />
    </>
  );
};

export default ChatRoomHeadCountButton;
