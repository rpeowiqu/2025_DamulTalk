import {
  useRef,
  useState,
  type Dispatch,
  type DragEvent,
  type SetStateAction,
} from "react";
import { toast } from "sonner";

import type { UploadFile } from "@/types/chat/type";

interface UseFileDragOptions {
  uploadFile: UploadFile | null;
  setUploadFile: Dispatch<SetStateAction<UploadFile | null>>;
}

const useDragFile = ({ uploadFile, setUploadFile }: UseFileDragOptions) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.types.includes("Files")) {
      if (++dragCounter.current === 1) {
        setIsDragging(true);
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.types.includes("Files")) {
      if (--dragCounter.current === 0) {
        setIsDragging(false);
      }
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const [file] = e.dataTransfer.files;
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        toast.error("이미지와 동영상 파일만 업로드할 수 있어요");
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
      e.dataTransfer.clearData();
    }
  };

  return {
    isDragging,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};

export default useDragFile;
