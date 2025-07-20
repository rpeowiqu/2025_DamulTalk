import type { Ref } from "react";

import type { Message } from "@/types/chat/type";
import SystemChatMessage from "@/components/chat/system-chat-message";
import OutgoingChatMessage from "@/components/chat/outgoing-chat-message";
import IncomingChatMessage from "@/components/chat/incoming-chat-message";
import useCurrentUser from "@/hooks/auth/use-current-user";

export interface ChatMessageProps {
  ref?: Ref<HTMLDivElement>;
  message: Message;
  onClick?: (_message: Message) => void;
}

const ChatMessage = ({ ref, message, onClick }: ChatMessageProps) => {
  const { data } = useCurrentUser();

  const renderMessage = () => {
    if (!data) {
      return null;
    }

    switch (message.senderId) {
      case 0: // 시스템 메시지
        return <SystemChatMessage ref={ref} message={message} />;
      case data.userId: // 발신 메시지
        return (
          <OutgoingChatMessage ref={ref} message={message} onClick={onClick} />
        );
      default: // 수신 메시지
        return (
          <IncomingChatMessage ref={ref} message={message} onClick={onClick} />
        );
    }
  };

  return renderMessage();
};

export default ChatMessage;
