import FriendAcceptButton from "@/components/user/friend-accept-button";
import FriendRejectButton from "@/components/user/friend-reject-button";
import UserItem, { type UserItemProps } from "@/components/user/user-item";

const FriendRequestItem = ({ userInfo, ...props }: UserItemProps) => {
  return (
    <UserItem userInfo={userInfo} {...props}>
      <FriendAcceptButton />
      <FriendRejectButton />
    </UserItem>
  );
};

export default FriendRequestItem;
