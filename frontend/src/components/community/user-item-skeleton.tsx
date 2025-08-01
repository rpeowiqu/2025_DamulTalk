import type { ReactNode } from "react";

interface UserItemSkeletonProps {
  visibleStatus?: boolean;
  children?: ReactNode;
}

const UserItemSkeleton = ({
  visibleStatus,
  children,
}: UserItemSkeletonProps) => {
  return (
    <div className="flex h-16 w-full items-center gap-3 rounded-xl bg-neutral-50 p-2 dark:bg-neutral-600">
      <div className="size-12 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-500" />
      <div className="flex flex-1">
        <div className="flex flex-1 flex-col gap-1">
          <div className="h-5 w-40 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-500" />
          {visibleStatus && (
            <div className="h-4 w-16 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-500" />
          )}
        </div>

        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </div>
  );
};

export default UserItemSkeleton;
