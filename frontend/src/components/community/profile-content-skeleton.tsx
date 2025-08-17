import UserItemSkeleton from "@/components/community/user-item-skeleton";

const ProfileContentSkeleton = () => {
  return (
    <div className="flex h-full flex-col gap-5 md:flex-row">
      <div className="flex w-full flex-1 flex-col gap-4">
        <div className="h-6 w-16 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-600" />
        <div className="flex flex-col gap-4 pl-5">
          <div className="flex flex-col gap-2">
            <div className="h-5 w-12 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-600" />
            <div className="h-5 w-32 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-600" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="h-5 w-12 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-600" />
            <div className="h-32 w-full animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-600" />
          </div>
        </div>
      </div>

      <div className="h-0.5 w-full bg-neutral-50 md:h-full md:w-0.5 dark:bg-neutral-500" />

      <div className="flex w-full flex-col gap-4 md:w-72">
        <div className="h-6 w-12 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-600" />
        <div className="h-12 w-full animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-600" />
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
