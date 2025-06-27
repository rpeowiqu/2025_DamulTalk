import type { ChatMessageInfo } from "@/types/chat/type";
import SystemChatMessage from "@/components/chat/system-chat-message";
import OutgoingChatMessage from "@/components/chat/outgoing-chat-message";
import IncomingChatMessage from "@/components/chat/incoming-chat-message";

export interface ChatMessageProps {
  message: ChatMessageInfo;
  onClick?: (_message: ChatMessageInfo) => void;
}

const ChatMessage = ({ message, onClick }: ChatMessageProps) => {
  const renderMessage = () => {
    if (message.nickname === "SYSTEM") {
      return <SystemChatMessage message={message} />;
    } else if (message.senderId === 1) {
      return <OutgoingChatMessage message={message} onClick={onClick} />;
    } else {
      return <IncomingChatMessage message={message} onClick={onClick} />;
    }
  };

  return renderMessage();
};

export default ChatMessage;
