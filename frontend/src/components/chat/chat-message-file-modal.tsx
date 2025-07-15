import Dialog, { type DialogProps } from "@/components/common/dialog";
import type { Message } from "@/types/chat/type";

interface ChatMessageFileModalProps extends DialogProps {
  message: Message | null;
}

const ChatMessageFileModal = ({
  open,
  onOpenChange,
  message,
  ...props
}: ChatMessageFileModalProps) => {
  const renderContent = () => {
    if (!message) {
      return null;
    }

    switch (message.messageType) {
      case "IMAGE":
        return (
          <img
            src={message.fileUrl}
            alt="첨부 이미지"
            className="max-h-120 object-cover"
          />
        );
      case "VIDEO":
        return (
          <video
            src={message.fileUrl}
            className="max-h-120 w-full object-cover"
            controls
          />
        );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="메시지 첨부 파일"
      titleClassName="text-damul-main-300 border-b border-damul-main-500 pb-4"
      {...props}>
      <div className="mt-2 flex items-center justify-center">
        {renderContent()}
      </div>
    </Dialog>
  );
};

export default ChatMessageFileModal;
