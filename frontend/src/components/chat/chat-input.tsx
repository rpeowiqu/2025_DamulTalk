import { useContext, useEffect, useRef, type KeyboardEvent } from "react";
import { useParams } from "react-router-dom";

import Button from "@/components/common/button";
import FileUploadButton from "@/components/common/file-upload-button";
import ChatUploadFileItem from "@/components/chat/chat-upload-file-item";
import MultiMediaIcon from "@/components/icon/multi-media-icon";
import {
  FileUploadDispatchContext,
  FileUploadStateContext,
} from "@/contexts/chat/file-upload-provider";
import { WebSocketDispatchContext } from "@/contexts/chat/web-socket-provider";
import type { WsMessageRequest } from "@/types/web-socket/type";
import useCurrentUser from "@/hooks/auth/use-current-user";
import useSendFile from "@/hooks/chat/use-send-file";

interface ChatInputProps {
  triggerScroll: () => void;
}

const ChatInput = ({ triggerScroll }: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const uploadFile = useContext(FileUploadStateContext);
  const setUploadFile = useContext(FileUploadDispatchContext);
  const { publishMessage } = useContext(WebSocketDispatchContext)!;
  const { roomId } = useParams();
  const { data } = useCurrentUser();
  const { mutateAsync: sendFile } = useSendFile();

  useEffect(() => {
    if (uploadFile) {
      textareaRef.current?.focus();
    }
  }, [uploadFile]);

  const sendMessage = async () => {
    if (!data || !publishMessage) {
      return;
    }

    // 파일을 전송하는 경우
    if (uploadFile) {
      await sendFile({
        roomId: Number(roomId),
        file: uploadFile.file,
        clientId: "clientId",
      });
    }
    // 텍스트를 전송하는 경우
    else if (textareaRef.current && textareaRef.current.value) {
      publishMessage<WsMessageRequest>("/pub/chats/messages", {
        roomId: Number(roomId),
        senderId: data.userId,
        messageType: "TEXT",
        content: textareaRef.current.value,
        clientId: "clientId",
      });
    }

    if (textareaRef.current) {
      textareaRef.current.value = "";
    }

    triggerScroll();
    setUploadFile!(null);
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
    <div className="bg-neutral-50 p-6 pt-0">
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
