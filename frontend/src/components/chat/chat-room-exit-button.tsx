import { LogOutIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

import useModal from "@/hooks/common/use-modal";
import ChatRoomExitModal from "@/components/chat/chat-room-exit-modal";
import type { ChatRoomInfo } from "@/types/chat/type";

interface ChatRoomExitButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  room: ChatRoomInfo;
}

const ChatRoomExitButton = ({ room, ...props }: ChatRoomExitButtonProps) => {
  const { isOpen, openModal, closeModal } = useModal({
    modalKey: "chat-room-exit",
  });

  const handleClick = () => {
    openModal();
  };

  return (
    <>
      <button className="cursor-pointer" {...props} onClick={handleClick}>
        <LogOutIcon />
      </button>

      <ChatRoomExitModal
        room={room}
        closeModal={closeModal}
        open={isOpen}
        onOpenChange={(open: boolean) => {
          if (open) {
            openModal();
          } else {
            closeModal();
          }
        }}
      />
    </>
  );
};

export default ChatRoomExitButton;
