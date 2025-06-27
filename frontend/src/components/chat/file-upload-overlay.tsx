import MultiMediaIcon from "@/components/icon/multi-media-icon";

const FileUploadOverlay = () => {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 text-white">
      <div className="fixed top-1/2 left-1/2 flex translate-x-1/3 -translate-y-1/2 flex-col items-center justify-center gap-4">
        <MultiMediaIcon className="size-20" />
        <p className="text-2xl">이곳에 파일을 업로드 하세요</p>
      </div>
    </div>
  );
};

export default FileUploadOverlay;
