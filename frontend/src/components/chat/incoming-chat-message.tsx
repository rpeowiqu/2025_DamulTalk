import { PlayCircleIcon } from "lucide-react";

import type { ChatMessageProps } from "@/components/chat/chat-message";
import UserPortrait from "@/components/user/user-portrait";

const IncomingChatMessage = ({ message, onClick }: ChatMessageProps) => {
  const renderContent = () => {
    switch (message.messageType) {
      case "TEXT":
        return message.content;
      case "IMAGE":
        return message.fileUrl ? (
          <img
            src={message.fileUrl}
            alt="첨부 이미지"
            className="size-24 cursor-pointer object-cover"
            onClick={() => onClick?.(message)}
          />
        ) : null;
      case "VIDEO":
        return message.fileUrl ? (
          <div
            className="relative cursor-pointer"
            onClick={() => onClick?.(message)}>
            <video src={message.fileUrl} className="size-24 object-cover" />
            <PlayCircleIcon className="fill-damul-main-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 stroke-white" />
          </div>
        ) : null;
    }
  };

  return (
    <div className="flex w-full gap-3">
      <UserPortrait
        profileImageUrl={message.profileImageUrl}
        className="shrink-0"
      />
      <div className="flex flex-col gap-2">
        <p className="font-bold">{message.nickname}</p>
        <div className="flex items-end gap-1 break-all whitespace-pre-wrap">
          <div className="flex max-w-96 flex-col gap-2 rounded-xl bg-white p-3">
            {renderContent()}
          </div>

          <div className="flex shrink-0 flex-col text-[0.675rem]">
            <p className="text-damul-main-500">
              {message.unReadCount > 99 ? "99+" : message.unReadCount}
            </p>
            <p className="text-neutral-500">{message.sentTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingChatMessage;
