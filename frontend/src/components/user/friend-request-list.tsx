import FriendRequestItem from "./friend-request-item";

const FriendRequestList = () => {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 2 }).map((_, index) => (
        <FriendRequestItem
          userId={index + 1}
          key={index}
          nickname={`토마토러버전종우${index + 1}`}
        />
      ))}
    </div>
  );
};

export default FriendRequestList;
