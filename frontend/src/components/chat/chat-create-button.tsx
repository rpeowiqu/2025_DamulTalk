import { useState } from "react";

import ChatCreateIcon from "@/components/icon/chat-create-icon";
import ChatCreateModal from "@/components/chat/chat-create-modal";
import useModal from "@/hooks/common/use-modal";
import type { ChatCreateInfo } from "@/types/chat/type";

const ChatCreateButton = () => {
  const [chatCreateInfo, setChatCreateInfo] = useState<ChatCreateInfo>({
    title: "",
    selectedUsers: [],
  });
  const { isOpen, openModal, closeModal } = useModal({
    modalKey: "chat-create",
    onClose: () => setChatCreateInfo({ title: "", selectedUsers: [] }),
  });

  const handleClick = () => {
    openModal();
  };

  return (
    <>
      <button type="button" className="cursor-pointer" onClick={handleClick}>
        <ChatCreateIcon />
      </button>

      <ChatCreateModal
        open={isOpen}
        onOpenChange={(open: boolean) => {
          if (open) {
            openModal();
          } else {
            closeModal();
          }
        }}
        chatCreateInfo={chatCreateInfo}
        setChatCreateInfo={setChatCreateInfo}
      />
    </>
  );
};

export default ChatCreateButton;
