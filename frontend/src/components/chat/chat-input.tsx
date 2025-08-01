import { useContext, useEffect, useRef, type KeyboardEvent } from "react";

import Button from "@/components/common/button";
import FileUploadButton from "@/components/common/file-upload-button";
import ChatUploadFileItem from "@/components/chat/chat-upload-file-item";
import MultiMediaIcon from "@/components/icon/multi-media-icon";
import {
  FileUploadDispatchContext,
  FileUploadStateContext,
} from "@/contexts/chat/file-upload-provider";
import useCurrentUser from "@/hooks/auth/use-current-user";
import type { Message } from "@/types/chat/type";

interface ChatInputProps {
  sendMessage: (_message: Message, _file?: File) => void;
}

const ChatInput = ({ sendMessage }: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const uploadFile = useContext(FileUploadStateContext);
  const setUploadFile = useContext(FileUploadDispatchContext);

  const { data } = useCurrentUser();

  useEffect(() => {
    if (uploadFile) {
      textareaRef.current?.focus();
    }
  }, [uploadFile]);

  const handleSendMessage = async () => {
    if (!data) {
      return;
    }

    const clientId = new Date().toISOString();

    // 파일을 전송하는 경우
    if (uploadFile) {
      sendMessage(
        {
          messageId: clientId,
          senderId: data.userId,
          profileImageUrl: "",
          nickname: data.nickname,
          messageType: uploadFile.file.type.startsWith("image/")
            ? "IMAGE"
            : "VIDEO",
          messageStatus: "SENDING",
          content: "",
          fileUrl: uploadFile.objectUrl,
          sendTime: clientId,
          unReadCount: 0,
          clientId,
        },
        uploadFile.file,
      );
    }
    // 텍스트를 전송하는 경우
    else if (textareaRef.current && textareaRef.current.value) {
      sendMessage({
        messageId: clientId,
        senderId: data.userId,
        profileImageUrl: "",
        nickname: data.nickname,
        messageType: "TEXT",
        messageStatus: "SENDING",
        content: textareaRef.current.value,
        sendTime: clientId,
        unReadCount: 0,
        clientId,
      });
    }

    if (textareaRef.current) {
      textareaRef.current.value = "";
    }

    setUploadFile!(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!e.shiftKey && e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteFile = () => {
    if (uploadFile?.objectUrl) {
      URL.revokeObjectURL(uploadFile.objectUrl);
    }

    setUploadFile!(null);
  };

  return (
    <div className="z-10 bg-neutral-50 p-6 pt-0 dark:bg-neutral-700">
      <div className="focus-within:ring-damul-main-300 flex h-40 flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-4 focus-within:ring-2 dark:border-neutral-500 dark:bg-neutral-600">
        <div className="relative flex-1">
          {uploadFile && (
            <div className="absolute top-0 left-0">
              <ChatUploadFileItem
                uploadFile={uploadFile}
                onDelete={handleDeleteFile}
              />
            </div>
          )}

          <textarea
            ref={textareaRef}
            className="h-full w-full resize-none bg-white outline-none placeholder:text-neutral-300 dark:bg-neutral-600"
            placeholder={uploadFile ? "" : "메시지를 입력해 주세요"}
            onKeyDown={handleKeyDown}
            maxLength={500}
            readOnly={!!uploadFile}
          />
        </div>

        <div className="flex items-end justify-between">
          <FileUploadButton
            uploadFile={uploadFile}
            setUploadFile={setUploadFile!}
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-500 dark:hover:text-white">
            <MultiMediaIcon className="size-5" />
          </FileUploadButton>
          <Button className="py-2 text-base" onClick={handleSendMessage}>
            전송
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
