import type { ChatMessageProps } from "@/components/chat/chat-message";

const SystemChatMessage = ({ ref, message }: ChatMessageProps) => {
  return (
    <div
      ref={ref}
      className="border-b border-neutral-300 py-2 text-center text-neutral-500">
      {message.content}
    </div>
  );
};

export default SystemChatMessage;
