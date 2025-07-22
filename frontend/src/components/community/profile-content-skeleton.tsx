import UserItemSkeleton from "@/components/community/user-item-skeleton";

const ProfileContentSkeleton = () => {
  return (
    <div className="flex gap-4">
      <div className="flex min-w-120 flex-1 flex-col gap-4">
        <div className="h-6 w-16 animate-pulse rounded-xl bg-neutral-200" />
        <div className="flex flex-col gap-4 pl-5">
          <div className="flex flex-col gap-2">
            <div className="h-5 w-12 animate-pulse rounded-xl bg-neutral-200" />
            <div className="h-5 w-32 animate-pulse rounded-xl bg-neutral-200" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="h-5 w-12 animate-pulse rounded-xl bg-neutral-200" />
            <div className="h-32 w-full animate-pulse rounded-xl bg-neutral-200" />
          </div>
        </div>
      </div>

      <div className="h-full w-0.5 bg-neutral-50"></div>

      <div className="flex min-w-72 flex-col gap-4">
        <div className="h-6 w-12 animate-pulse rounded-xl bg-neutral-200" />
        <div className="h-12 w-full animate-pulse rounded-xl bg-neutral-200" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <UserItemSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileContentSkeleton;
