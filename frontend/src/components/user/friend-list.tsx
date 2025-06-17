import UserItem from "@/components/user/user-item";

interface FriendListProps {
  visibleStatus: boolean;
}

const FriendList = ({ visibleStatus }: FriendListProps) => {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 8 }).map((_, index) => (
        <UserItem
          key={index}
          userId={index + 1}
          nickname={`토마토러버전종우${index + 1}`}
          online={visibleStatus ? true : undefined}
        />
      ))}
    </div>
  );
};

export default FriendList;
