import { AlertTriangleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Dialog, { type DialogProps } from "@/components/common/dialog";
import type { ChatRoomInfo } from "@/types/chat/type";
import Button from "@/components/common/button";

interface ChatRoomExitModalProps extends DialogProps {
  room: ChatRoomInfo;
  closeModal: () => void;
}

const ChatRoomExitModal = ({
  room,
  closeModal,
  open,
  onOpenChange,
  ...props
}: ChatRoomExitModalProps) => {
  const navigate = useNavigate();

  const handleClickCancel = () => {
    closeModal();
  };

  const handleClickExit = () => {
    navigate(`/profile/${1}`);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="채팅방 나가기"
      titleClassName="text-damul-main-300 border-b border-damul-main-500 pb-4"
      {...props}>
      <div className="mt-3 flex flex-col gap-10">
        <div className="flex items-center gap-10 px-8">
          <AlertTriangleIcon className="size-10 text-red-400" />
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-lg font-bold">{room.roomName}</h1>
            <p className="text-neutral-500">정말 이 채팅방을 나갈까요?</p>
          </div>
        </div>

        <div className="flex w-full gap-4">
          <Button className="w-full" onClick={handleClickCancel}>
            돌아가기
          </Button>
          <Button
            variant="dangerous"
            className="w-full"
            onClick={handleClickExit}>
            나가기
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ChatRoomExitModal;
