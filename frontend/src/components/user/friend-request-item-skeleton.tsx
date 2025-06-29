import UserItemSkeleton from "./user-item-skeleton";

const FriendRequestItemSkeleton = () => {
  return (
    <UserItemSkeleton>
      <div className="size-6 animate-pulse rounded-full bg-neutral-200" />
      <div className="size-6 animate-pulse rounded-full bg-neutral-200" />
    </UserItemSkeleton>
  );
};

export default FriendRequestItemSkeleton;
