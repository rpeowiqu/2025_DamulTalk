import type { Message } from "@/types/chat/type";
import SystemChatMessage from "@/components/chat/system-chat-message";
import OutgoingChatMessage from "@/components/chat/outgoing-chat-message";
import IncomingChatMessage from "@/components/chat/incoming-chat-message";
import useCurrentUser from "@/hooks/auth/use-current-user";

export interface ChatMessageProps {
  message: Message;
  onClick?: (_message: Message) => void;
}

const ChatMessage = ({ message, onClick }: ChatMessageProps) => {
  const { data } = useCurrentUser();

  const renderMessage = () => {
    if (!data) {
      return null;
    }

    if (message.nickname === "SYSTEM") {
      return <SystemChatMessage message={message} />;
    } else if (message.senderId === data.userId) {
      return <OutgoingChatMessage message={message} onClick={onClick} />;
    } else {
      return <IncomingChatMessage message={message} onClick={onClick} />;
    }
  };

  return renderMessage();
};

export default ChatMessage;
