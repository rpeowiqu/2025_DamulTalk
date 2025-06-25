import type { ChatMessageProps } from "@/components/chat/chat-message";

const OutgoingChatMessage = ({ messageInfo }: ChatMessageProps) => {
  const renderContent = () => {
    switch (messageInfo.messageType) {
      case "TEXT":
        return messageInfo.content;
      case "IMAGE":
        return messageInfo.fileUrl ? (
          <img
            src={messageInfo.fileUrl}
            alt="첨부 이미지"
            className="size-24 object-cover"
          />
        ) : null;
      case "VIDEO":
        return messageInfo.fileUrl ? <video src={messageInfo.fileUrl} /> : null;
    }
  };

  return (
    <div className="flex max-w-100 items-end gap-1 self-end break-all whitespace-pre-wrap">
      <p className="shrink-0 text-[0.675rem] text-neutral-500">
        {messageInfo.sentTime}
      </p>

      <div className="bg-damul-main-50 flex flex-col gap-2 rounded-xl p-3">
        {renderContent()}
      </div>
    </div>
  );
};

export default OutgoingChatMessage;
