import { useRef, useState } from "react";

import ChatCreateIcon from "@/components/icon/chat-create-icon";
import ChatCreateModal from "@/components/chat/chat-create-modal";
import useModal from "@/hooks/common/use-modal";
import type { ChatCreateInfo } from "@/types/chat/type";

const ChatCreateButton = () => {
  const [chatCreateInfo, setChatCreateInfo] = useState<ChatCreateInfo>({
    roomName: "",
    selectedUsers: [],
  });
  const isDefaultName = useRef(false);
  const { isOpen, openModal, closeModal } = useModal({
    modalKey: "chat-create",
    onClose: () => setChatCreateInfo({ roomName: "", selectedUsers: [] }),
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
        type="button"
        className="cursor-pointer dark:text-neutral-200"
        onClick={handleClick}>
        <ChatCreateIcon />
      </button>

      <ChatCreateModal
        open={isOpen}
        onOpenChange={handleOpenChange}
        chatCreateInfo={chatCreateInfo}
        setChatCreateInfo={setChatCreateInfo}
        isDefaultName={isDefaultName}
      />
    </>
  );
};

export default ChatCreateButton;
