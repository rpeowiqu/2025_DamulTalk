import type { ChatMessageInfo } from "@/types/chat/type";
import SystemChatMessage from "@/components/chat/system-chat-message";
import OutgoingChatMessage from "@/components/chat/outgoing-chat-message";
import IncomingChatMessage from "@/components/chat/incoming-chat-message";

export interface ChatMessageProps {
  messageInfo: ChatMessageInfo;
}

const ChatMessage = ({ messageInfo }: ChatMessageProps) => {
  const renderMessage = () => {
    if (messageInfo.nickname === "SYSTEM") {
      return <SystemChatMessage messageInfo={messageInfo} />;
    } else if (messageInfo.senderId === 1) {
      return <OutgoingChatMessage messageInfo={messageInfo} />;
    } else {
      return <IncomingChatMessage messageInfo={messageInfo} />;
    }
  };

  return renderMessage();
};

export default ChatMessage;
