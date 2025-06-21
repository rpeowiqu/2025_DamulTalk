import UserPortrait from "@/components/user/user-portrait";
import type { ChatMessageInfo } from "@/types/chat/type";

interface ChatMessageProps {
  messageInfo: ChatMessageInfo;
}

const ChatMessage = ({ messageInfo }: ChatMessageProps) => {
  return (
    <>
      {messageInfo.senderId === 1 ? (
        <div className="flex max-w-100 items-end gap-1 self-end">
          <p className="shrink-0 text-[0.675rem] text-neutral-500">
            {messageInfo.sentTime}
          </p>
          <p className="bg-damul-main-50 rounded-xl p-3 whitespace-pre-wrap">
            {messageInfo.content}
          </p>
        </div>
      ) : (
        <div className="flex w-full gap-3">
          <UserPortrait
            profileImageUrl={messageInfo.profileImageUrl}
            className="shrink-0"
          />
          <div className="flex flex-col gap-2">
            <p className="font-bold">{messageInfo.nickname}</p>
            <div className="flex max-w-100 items-end gap-1">
              <p className="rounded-xl bg-white p-3 whitespace-pre-wrap">
                {messageInfo.content}
              </p>
              <p className="shrink-0 text-[0.675rem] text-neutral-500">
                {messageInfo.sentTime}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatMessage;
