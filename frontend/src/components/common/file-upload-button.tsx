import {
  type Dispatch,
  type ButtonHTMLAttributes,
  type SetStateAction,
  type ChangeEvent,
  type InputHTMLAttributes,
  useRef,
  type MouseEvent,
  useEffect,
} from "react";
import { toast } from "sonner";

import type { UploadFile } from "@/types/chat/type";
import { cn } from "@/utils/style";
import { MAX_FILE_UPLOAD_SIZE } from "@/utils/file";

interface FileUploadButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  uploadFile: UploadFile | null;
  setUploadFile: Dispatch<SetStateAction<UploadFile | null>>;
  inputAttributes?: InputHTMLAttributes<HTMLInputElement>;
}

const FileUploadButton = ({
  uploadFile,
  setUploadFile,
  inputAttributes,
  className,
  children,
  onClick,
  ...props
}: FileUploadButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!uploadFile && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [uploadFile]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const [file] = e.target.files;
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        toast.error("이미지와 동영상 파일만 업로드할 수 있어요");
        return;
      }

      if (file.size >= MAX_FILE_UPLOAD_SIZE) {
        toast.error("파일 크기가 20MB보다 커요");
        return;
      }

      if (uploadFile && uploadFile.objectUrl) {
        URL.revokeObjectURL(uploadFile.objectUrl);
      }

      const objectUrl = URL.createObjectURL(file);
      setUploadFile({
        file,
        objectUrl,
      });
    }
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    inputRef.current?.click();
    onClick?.(e);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        onChange={handleChange}
        accept="image/*,video/*"
        hidden
        readOnly
        {...inputAttributes}
      />
      <button
        className={cn("cursor-pointer", className)}
        onClick={handleClick}
        {...props}>
        {children}
      </button>
    </div>
  );
};

export default FileUploadButton;
