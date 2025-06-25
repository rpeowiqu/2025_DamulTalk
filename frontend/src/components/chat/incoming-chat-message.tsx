import type { ChatMessageProps } from "@/components/chat/chat-message";
import UserPortrait from "@/components/user/user-portrait";

const IncomingChatMessage = ({ messageInfo }: ChatMessageProps) => {
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
    <div className="flex w-full gap-3">
      <UserPortrait
        profileImageUrl={messageInfo.profileImageUrl}
        className="shrink-0"
      />
      <div className="flex flex-col gap-2">
        <p className="font-bold">{messageInfo.nickname}</p>
        <div className="flex max-w-100 items-end gap-1 break-all whitespace-pre-wrap">
          <div className="flex flex-col gap-2 rounded-xl bg-white p-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingChatMessage;
