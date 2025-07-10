import { PlayCircleIcon } from "lucide-react";

import type { ChatMessageProps } from "@/components/chat/chat-message";
import { getFormattedTime } from "@/utils/time";

const OutgoingChatMessage = ({ message, onClick }: ChatMessageProps) => {
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
    <div className="flex items-end gap-2 self-end break-all whitespace-pre-wrap">
      <div className="flex shrink-0 flex-col text-[0.675rem]">
        <p className="text-damul-main-500 text-end">
          {message.unReadCount > 99 ? "99+" : message.unReadCount}
        </p>
        <p className="text-neutral-500">{getFormattedTime(message.sendTime)}</p>
      </div>

      <div className="bg-damul-main-50 flex max-w-96 flex-col gap-2 rounded-xl p-3">
        {renderContent()}
      </div>
    </div>
  );
};

export default OutgoingChatMessage;
