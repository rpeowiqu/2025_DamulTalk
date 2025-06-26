import ChatRoomContent from "@/components/chat/chat-room-content";
import ChatRoomHeader from "@/components/chat/chat-room-header";
import FileUploadProvider from "@/contexts/chat/file-upload-provider";

const ChatPage = () => {
  return (
    <FileUploadProvider>
      <div className="flex h-full flex-col bg-neutral-50">
        <ChatRoomHeader
          roomInfo={{
            roomName: "SSAFY 12기 공통 프로젝트 A306",
            roomSize: 6,
            profileImages: ["", "", "", ""],
            members: [],
          }}
        />
        <ChatRoomContent />
      </div>
    </FileUploadProvider>
  );
};

export default ChatPage;
