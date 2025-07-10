import {
  createContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import type { UploadFile } from "@/types/chat/type";
import FileUploadOverlay from "@/components/chat/file-upload-overlay";
import useDragFile from "@/hooks/chat/use-drag-file";

interface FileUploadProviderProps {
  children: ReactNode;
}

export const FileUploadStateContext = createContext<UploadFile | null>(null);
export const FileUploadDispatchContext = createContext<Dispatch<
  SetStateAction<UploadFile | null>
> | null>(null);

const FileUploadProvider = ({ children }: FileUploadProviderProps) => {
  const [uploadFile, setUploadFile] = useState<UploadFile | null>(null);
  const {
    isDragging,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useDragFile({ uploadFile, setUploadFile });

  return (
    <FileUploadStateContext value={uploadFile}>
      <FileUploadDispatchContext value={setUploadFile}>
        <div
          className="relative h-dvh"
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}>
          {children}
          {isDragging && <FileUploadOverlay />}
        </div>
      </FileUploadDispatchContext>
    </FileUploadStateContext>
  );
};

export default FileUploadProvider;
