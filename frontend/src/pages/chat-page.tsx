import ChatRoomContent from "@/components/chat/chat-room-content";
import ChatRoomHeader from "@/components/chat/chat-room-header";
import FileUploadProvider from "@/contexts/chat/file-upload-provider";
import ChatRoomDummyData from "@/mocks/chat-room.json";

const ChatPage = () => {
  return (
    <FileUploadProvider>
      <div className="flex h-full flex-col bg-neutral-50">
        <ChatRoomHeader room={ChatRoomDummyData} />
        <ChatRoomContent />
      </div>
    </FileUploadProvider>
  );
};

export default ChatPage;
