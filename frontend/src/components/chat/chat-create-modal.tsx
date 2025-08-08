import { type Dispatch, type RefObject, type SetStateAction } from "react";

import Dialog, { type DialogProps } from "@/components/common/dialog";
import type { ChatCreateInfo } from "@/types/chat/type";
import ChatCreateForm from "@/components/chat/chat-create-form";

interface ChatCreateModalProps extends DialogProps {
  chatCreateInfo: ChatCreateInfo;
  setChatCreateInfo: Dispatch<SetStateAction<ChatCreateInfo>>;
  isDefaultName: RefObject<boolean>;
}

const ChatCreateModal = ({
  chatCreateInfo,
  setChatCreateInfo,
  isDefaultName,
  open,
  onOpenChange,
  ...props
}: ChatCreateModalProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="채팅방 만들기"
      titleClassName="text-damul-main-300 border-b border-damul-main-300 pb-4 mb-2"
      {...props}>
      <ChatCreateForm
        chatCreateInfo={chatCreateInfo}
        setChatCreateInfo={setChatCreateInfo}
        isDefaultName={isDefaultName}
      />
    </Dialog>
  );
};

export default ChatCreateModal;
