import { useParams } from "react-router-dom";

import ChatRoomContent from "@/components/chat/chat-room-content";
import ChatRoomHeader from "@/components/chat/chat-room-header";
import FileUploadProvider from "@/contexts/chat/file-upload-provider";
import useChatRoom from "@/hooks/chat/use-chat-room";
import ChatRoomHeaderSkeleton from "@/components/chat/chat-room-header-skeleton";
import ChatRoomContentSkeleton from "@/components/chat/chat-room-content-skeleton";

const ChatPage = () => {
  const { roomId } = useParams();
  const { data, isLoading } = useChatRoom(roomId ? Number(roomId) : 0);

  return (
    <FileUploadProvider>
      <div className="flex h-full flex-col bg-neutral-50">
        {isLoading ? (
          <>
            <ChatRoomHeaderSkeleton />
            <ChatRoomContentSkeleton />
          </>
        ) : data ? (
          <>
            <ChatRoomHeader room={data} />
            <ChatRoomContent />
          </>
        ) : null}
      </div>
    </FileUploadProvider>
  );
};

export default ChatPage;
