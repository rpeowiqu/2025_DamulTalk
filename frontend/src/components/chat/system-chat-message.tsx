import type { ChatMessageProps } from "@/components/chat/chat-message";

const SystemChatMessage = ({ messageInfo }: ChatMessageProps) => {
  return (
    <div className="border-b border-neutral-300 py-2 text-center text-neutral-500">
      {messageInfo.content}
    </div>
  );
};

export default SystemChatMessage;
