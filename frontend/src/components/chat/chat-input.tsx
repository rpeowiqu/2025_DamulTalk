import {
  useRef,
  type Dispatch,
  type KeyboardEvent,
  type SetStateAction,
} from "react";

import { getFormattedTime } from "@/utils/time";
import type { ChatMessageInfo } from "@/types/chat/type";
import Button from "@/components/common/button";

interface ChatInputProps {
  setChatMessages: Dispatch<SetStateAction<ChatMessageInfo[]>>;
  triggerScroll: () => void;
}

const ChatInput = ({ setChatMessages, triggerScroll }: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const nextMessageId = useRef(10); // 임시 messageId 용도

  const sendMessage = () => {
    if (textareaRef.current && textareaRef.current.value) {
      const content = textareaRef.current.value;
      if (content) {
        const sentTime = getFormattedTime();
        setChatMessages((prev) => [
          ...prev,
          {
            messageId: nextMessageId.current++,
            senderId: 1,
            profileImageUrl: "",
            nickname: "토마토러버전종우",
            messageType: "TEXT",
            content,
            sentTime,
            unReadCount: 1,
          },
        ]);

        textareaRef.current.value = "";
        triggerScroll();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!e.shiftKey && e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="sticky bottom-0 z-10 bg-neutral-50 pb-6">
      <div className="focus-within:ring-damul-main-300 flex h-44 flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition-all duration-200 focus-within:ring-2">
        <textarea
          ref={textareaRef}
          className="w=full flex-1 resize-none bg-white outline-none placeholder:text-neutral-300"
          placeholder="메시지를 입력해 주세요"
          onKeyDown={handleKeyDown}
          maxLength={500}
        />

        <Button className="self-end py-2 text-base" onClick={sendMessage}>
          전송
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
