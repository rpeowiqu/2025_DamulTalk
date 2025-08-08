import FriendAcceptButton from "@/components/community/friend-accept-button";
import FriendRejectButton from "@/components/community/friend-reject-button";
import UserItem, { type UserItemProps } from "@/components/community/user-item";

const FriendRequestItem = ({ user, ...props }: UserItemProps) => {
  return (
    <UserItem user={user} {...props}>
      <FriendAcceptButton userId={user.userId} />
      <FriendRejectButton userId={user.userId} />
    </UserItem>
  );
};

export default FriendRequestItem;
