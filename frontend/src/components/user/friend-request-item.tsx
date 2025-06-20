import FriendAcceptButton from "@/components/user/friend-accept-button";
import FriendRejectButton from "@/components/user/friend-reject-button";
import UserItem, { type UserItemProps } from "@/components/user/user-item";

const FriendRequestItem = ({ userInfo, ...props }: UserItemProps) => {
  return (
    <UserItem userInfo={userInfo} {...props}>
      <div className="flex items-center gap-2">
        <FriendAcceptButton />
        <FriendRejectButton />
      </div>
    </UserItem>
  );
};

export default FriendRequestItem;
