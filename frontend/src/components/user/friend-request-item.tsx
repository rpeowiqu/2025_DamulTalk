import FriendAcceptButton from "@/components/user/friend-accept-button";
import FriendRejectButton from "@/components/user/friend-reject-button";
import UserItem, { type UserItemProps } from "@/components/user/user-item";

const FriendRequestItem = ({ user, ...props }: UserItemProps) => {
  return (
    <UserItem user={user} {...props}>
      <FriendAcceptButton />
      <FriendRejectButton />
    </UserItem>
  );
};

export default FriendRequestItem;
