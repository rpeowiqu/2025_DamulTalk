import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type KeyboardEvent,
  type SetStateAction,
} from "react";

import { getFormattedTime } from "@/utils/time";
import type { ChatMessageInfo, MessageType } from "@/types/chat/type";
import Button from "@/components/common/button";
import FileUploadButton from "@/components/common/file-upload-button";
import ChatUploadFileItem from "@/components/chat/chat-upload-file-item";
import MultiMediaIcon from "@/components/icon/multi-media-icon";
import type { UploadFile } from "@//types/chat/type";

interface ChatInputProps {
  setChatMessages: Dispatch<SetStateAction<ChatMessageInfo[]>>;
  triggerScroll: () => void;
}

const ChatInput = ({ setChatMessages, triggerScroll }: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const nextMessageId = useRef(13); // 임시 messageId 용도
  const [uploadFile, setUploadFile] = useState<UploadFile | null>(null);

  useEffect(() => {
    if (uploadFile) {
      textareaRef.current?.focus();
    }

    return () => {
      // createObjectURL()은 브라우저가 해당 파일을 메모리에 저장한 채 URL로 보여주는 거라서, 파일이 필요 없어졌을 땐 해제 필요
      if (uploadFile?.thumbnailImageUrl) {
        URL.revokeObjectURL(uploadFile.thumbnailImageUrl);
      }
    };
  }, [uploadFile]);

  const sendMessage = () => {
    if ((textareaRef.current && textareaRef.current.value) || uploadFile) {
      let messageType: MessageType = "TEXT";
      if (uploadFile) {
        messageType = uploadFile.file.type.startsWith("image/")
          ? "IMAGE"
          : "VIDEO";
      }
      const content = textareaRef.current?.value ?? "";
      const sentTime = getFormattedTime();
      setChatMessages((prev) => [
        ...prev,
        {
          messageId: nextMessageId.current++,
          senderId: 1,
          profileImageUrl: "",
          nickname: "토마토러버전종우",
          messageType,
          content,
          fileUrl: uploadFile?.thumbnailImageUrl ?? undefined,
          sentTime,
          unReadCount: 1,
        },
      ]);

      if (textareaRef.current) {
        textareaRef.current.value = "";
      }

      triggerScroll();
      setUploadFile(null);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!e.shiftKey && e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileDelete = () => {
    if (uploadFile?.thumbnailImageUrl) {
      URL.revokeObjectURL(uploadFile.thumbnailImageUrl);
    }

    setUploadFile(null);
  };

  return (
    <div className="sticky bottom-0 z-10 bg-neutral-50 pb-6">
      <div className="focus-within:ring-damul-main-300 flex h-40 flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-4 transition-all duration-200 focus-within:ring-2">
        <div className="relative flex-1">
          {uploadFile && (
            <div className="absolute top-0 left-0">
              <ChatUploadFileItem
                uploadFile={uploadFile}
                onDelete={handleFileDelete}
              />
            </div>
          )}

          <textarea
            ref={textareaRef}
            className="h-full w-full resize-none bg-white outline-none placeholder:text-neutral-300"
            placeholder={uploadFile ? "" : "메시지를 입력해 주세요"}
            onKeyDown={handleKeyDown}
            maxLength={500}
            readOnly={!!uploadFile}
          />
        </div>

        <div className="flex items-end justify-between">
          <FileUploadButton
            uploadFile={uploadFile}
            setUploadFile={setUploadFile}>
            <MultiMediaIcon className="size-5" />
          </FileUploadButton>
          <Button className="py-2 text-base" onClick={sendMessage}>
            전송
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
