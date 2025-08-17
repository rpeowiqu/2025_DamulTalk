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
    <div className="relative flex h-16 w-full max-w-72 items-center gap-2 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-500 dark:bg-neutral-700">
      <img
        src={uploadFile.objectUrl}
        alt="업로드 파일 이미지"
        className="size-10 object-cover"
      />
      <div className="flex flex-col gap-1 wrap-anywhere break-all">
        <h1 className="line-clamp-1 text-sm font-bold">
          {uploadFile.file.name}
        </h1>
        <p className="line-clamp-1 text-xs text-neutral-500 dark:text-neutral-200">
          {formatFileSize(uploadFile.file.size)}
        </p>
      </div>

      {onDelete && (
        <button
          className="absolute top-1.5 right-1.5 cursor-pointer rounded-full bg-black/50 p-0.5 text-white transition-colors duration-200 hover:bg-black dark:bg-white/50 dark:text-black dark:hover:bg-white"
          onClick={onDelete}>
          <XIcon className="size-3" />
        </button>
      )}
    </div>
  );
};

export default ChatUploadFileItem;
