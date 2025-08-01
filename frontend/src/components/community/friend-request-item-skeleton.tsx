import UserItemSkeleton from "./user-item-skeleton";

const FriendRequestItemSkeleton = () => {
  return (
    <UserItemSkeleton>
      <div className="size-6 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-500" />
      <div className="size-6 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-500" />
    </UserItemSkeleton>
  );
};

export default FriendRequestItemSkeleton;
