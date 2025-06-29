const UserItemSkeleton = () => {
  return (
    <div className="flex h-16 w-full items-center gap-3 rounded-xl bg-white p-2">
      <div className="size-12 animate-pulse rounded-full bg-neutral-100" />
      <div className="flex flex-col gap-1">
        <div className="h-5 w-40 animate-pulse rounded-xl bg-neutral-100" />
        <div className="h-4 w-16 animate-pulse rounded-xl bg-neutral-100" />
      </div>
    </div>
  );
};

export default UserItemSkeleton;
