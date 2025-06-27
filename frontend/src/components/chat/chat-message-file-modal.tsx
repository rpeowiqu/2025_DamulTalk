import Dialog, { type DialogProps } from "@/components/common/dialog";
import type { ChatMessageInfo } from "@/types/chat/type";

interface ChatMessageFileModalProps extends DialogProps {
  messageInfo: ChatMessageInfo | null;
}

const ChatMessageFileModal = ({
  open,
  onOpenChange,
  messageInfo,
  ...props
}: ChatMessageFileModalProps) => {
  const renderContent = () => {
    if (!messageInfo) {
      return null;
    }

    switch (messageInfo.messageType) {
      case "IMAGE":
        return (
          <img
            src={messageInfo.fileUrl}
            alt="첨부 이미지"
            className="w-full object-cover"
          />
        );
      case "VIDEO":
        return (
          <video
            src={messageInfo.fileUrl}
            className="w-full object-cover"
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
      <div className="flex items-center justify-center">{renderContent()}</div>
    </Dialog>
  );
};

export default ChatMessageFileModal;
