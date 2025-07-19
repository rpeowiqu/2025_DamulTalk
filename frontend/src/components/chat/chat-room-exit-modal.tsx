import { useParams } from "react-router-dom";

import Dialog, { type DialogProps } from "@/components/common/dialog";
import type { ChatRoom } from "@/types/chat/type";
import Button from "@/components/common/button";
import useExitChatRoom from "@/hooks/chat/use-exit-chat-room";

interface ChatRoomExitModalProps extends DialogProps {
  room: ChatRoom;
  closeModal: () => void;
}

const ChatRoomExitModal = ({
  room,
  closeModal,
  open,
  onOpenChange,
  ...props
}: ChatRoomExitModalProps) => {
  const { roomId } = useParams();
  const { mutate: exitChatRoom } = useExitChatRoom();

  const handleCancel = () => {
    closeModal();
  };

  const handleExit = () => {
    exitChatRoom(roomId ? Number(roomId) : 0);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="채팅방 나가기"
      titleClassName="text-damul-main-300 border-b border-damul-main-500 pb-4 mb-2"
      {...props}>
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <h1 className="text-lg font-bold">{room.roomName}</h1>
          <p className="text-neutral-600">정말 이 채팅방을 나갈까요?</p>
        </div>

        <div className="flex w-full gap-4">
          <Button className="w-full" onClick={handleCancel}>
            돌아가기
          </Button>
          <Button variant="dangerous" className="w-full" onClick={handleExit}>
            나가기
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ChatRoomExitModal;
