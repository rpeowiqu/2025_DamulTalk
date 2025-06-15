import UserItem from "@/components/user/UserItem";

interface FriendListProps {
  visibleStatus: boolean;
}

const FriendList = ({ visibleStatus }: FriendListProps) => {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <UserItem
          key={index}
          nickname={`토마토러버전종우${index + 1}`}
          online={visibleStatus ? true : undefined}
        />
      ))}
    </div>
  );
};

export default FriendList;
