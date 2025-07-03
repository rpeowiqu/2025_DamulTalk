import {
  useContext,
  useEffect,
  useRef,
  type Dispatch,
  type KeyboardEvent,
  type SetStateAction,
} from "react";

import { getFormattedTime } from "@/utils/time";
import type { Message, MessageType } from "@/types/chat/type";
import Button from "@/components/common/button";
import FileUploadButton from "@/components/common/file-upload-button";
import ChatUploadFileItem from "@/components/chat/chat-upload-file-item";
import MultiMediaIcon from "@/components/icon/multi-media-icon";
import {
  FileUploadDispatchContext,
  FileUploadStateContext,
} from "@/contexts/chat/file-upload-provider";

interface ChatInputProps {
  setChatMessages: Dispatch<SetStateAction<Message[]>>;
  triggerScroll: () => void;
}

const ChatInput = ({ setChatMessages, triggerScroll }: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const nextMessageId = useRef(13); // 임시 messageId 용도
  const uploadFile = useContext(FileUploadStateContext);
  const setUploadFile = useContext(FileUploadDispatchContext);

  useEffect(() => {
    if (uploadFile) {
      textareaRef.current?.focus();
    }
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
          fileUrl: uploadFile?.objectUrl ?? undefined,
          sentTime,
          unReadCount: 1,
        },
      ]);

      if (textareaRef.current) {
        textareaRef.current.value = "";
      }

      triggerScroll();
      setUploadFile!(null);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!e.shiftKey && e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileDelete = () => {
    if (uploadFile?.objectUrl) {
      URL.revokeObjectURL(uploadFile.objectUrl);
    }

    setUploadFile!(null);
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
            setUploadFile={setUploadFile!}>
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
