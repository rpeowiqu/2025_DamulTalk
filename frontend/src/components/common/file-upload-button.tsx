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

import type { UploadFile } from "@/types/chat/type";
import { cn } from "@/utils/style";

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
        alert("파일 형식이 올바르지 않아요!");
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setUploadFile({
        file: file,
        thumbnailImageUrl: objectUrl,
      });
    }
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    inputRef.current?.click();
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
        className={cn(
          "cursor-pointer rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-600",
          className,
        )}
        onClick={handleClick}>
        {children}
      </button>
    </div>
  );
};

export default FileUploadButton;
