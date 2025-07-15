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

    switch (message.senderId) {
      case 0: // 시스템 메시지
        return <SystemChatMessage message={message} />;
      case data.userId: // 발신 메시지
        return <OutgoingChatMessage message={message} onClick={onClick} />;
      default: // 수신 메시지
        return <IncomingChatMessage message={message} onClick={onClick} />;
    }
  };

  return renderMessage();
};

export default ChatMessage;
