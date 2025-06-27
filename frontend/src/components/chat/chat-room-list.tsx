import ChatRoomItem from "@/components/chat/chat-room-item";

const rooms = [
  {
    roomId: 1,
    roomName: "SSAFY 12기 공통 프로젝트 A306",
    roomSize: 6,
    profileImages: ["", "", "", ""],
    lastMessage: "다믈랭 포에버",
    unreadMessageNum: 8,
    selected: true,
  },
  {
    roomId: 2,
    roomName: "박새로이, 조이서, 장근원",
    roomSize: 4,
    profileImages: ["", "", ""],
    lastMessage:
      "시간은 누구에게나 공평하게 흐른다. 하지만 그와 나의 시간은 그 농도가 너무나도 달랐다.",
    unreadMessageNum: 0,
    selected: false,
  },
  {
    roomId: 3,
    roomName: "바나나러버한재서, 홍길동123",
    roomSize: 3,
    profileImages: ["", ""],
    lastMessage: "안녕 ㅎㅎㅎ",
    unreadMessageNum: 0,
    selected: false,
  },
  {
    roomId: 4,
    roomName: "토마토러버전종우",
    roomSize: 2,
    profileImages: [""],
    lastMessage: "ㅋㅋㅋㅋㅋㅋㅋ",
    unreadMessageNum: 10,
    selected: false,
  },
];

const ChatRoomList = () => {
  return (
    <div className="flex flex-col gap-2">
      {rooms.map((item) => (
        <ChatRoomItem key={item.roomId} {...item} />
      ))}
    </div>
  );
};

export default ChatRoomList;
