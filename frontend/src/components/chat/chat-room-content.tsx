import ChatMessage from "@/components/chat/chat-message";
import ChatDummyData from "@/mocks/chat-messages.json";

const ChatRoomContent = () => {
  return (
    <div className="flex flex-col gap-6 p-6">
      {ChatDummyData.map((item) => (
        <ChatMessage key={item.messageId} messageInfo={item} />
      ))}
    </div>
  );
};

export default ChatRoomContent;
