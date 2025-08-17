import { XIcon } from "lucide-react";

import type { UploadFile } from "@/types/chat/type";
import { formatFileSize } from "@/utils/file";

interface ChatUploadFileItemProps {
  uploadFile: UploadFile;
  onDelete?: () => void;
}

const ChatUploadFileItem = ({
  uploadFile,
  onDelete,
}: ChatUploadFileItemProps) => {
  return (
    <div className="relative flex h-16 w-64 items-center gap-2 rounded-xl border border-neutral-200 bg-white p-3">
      <img
        src={uploadFile.objectUrl}
        alt="업로드 파일 이미지"
        className="size-12 object-cover"
      />
      <div className="flex flex-col gap-1 wrap-anywhere break-all">
        <h1 className="line-clamp-1 text-sm font-bold">
          {uploadFile.file.name}
        </h1>
        <p className="line-clamp-1 text-xs text-neutral-500">
          {formatFileSize(uploadFile.file.size)}
        </p>
      </div>

      {onDelete && (
        <button
          className="absolute top-1 right-1 cursor-pointer rounded-full bg-black/50 p-0.5 text-white transition-colors duration-200 hover:bg-black"
          onClick={onDelete}>
          <XIcon className="size-3" />
        </button>
      )}
    </div>
  );
};

export default ChatUploadFileItem;
