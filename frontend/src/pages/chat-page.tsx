import ChatRoomHeader from "@/components/chat/chat-room-header";

const ChatPage = () => {
  return (
    <div className="flex h-full flex-col bg-neutral-50">
      <ChatRoomHeader
        roomInfo={{
          roomName: "SSAFY 12기 공통 프로젝트 A306",
          roomSize: 6,
          profileImages: ["", "", "", ""],
          members: [],
        }}
      />
    </div>
  );
};

export default ChatPage;
