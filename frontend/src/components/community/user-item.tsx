import type { MouseEvent, ReactNode } from "react";

import UserPortrait from "@/components/community/user-portrait";
import { cn } from "@/utils/style";
import type { User } from "@/types/community/type";

export interface UserItemProps {
  user: User;
  selected?: boolean;
  className?: string;
  onClick?: (_e: MouseEvent<HTMLDivElement>) => void;
  children?: ReactNode;
}

const UserItem = ({
  user,
  selected,
  className,
  onClick,
  children,
}: UserItemProps) => {
  return (
    <div
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 rounded-xl p-2 hover:bg-neutral-50 dark:hover:bg-neutral-700",
        selected
          ? "bg-damul-main-50 dark:bg-damul-main-600"
          : "bg-white dark:bg-neutral-800",
        className,
      )}
      onClick={onClick}>
      <UserPortrait
        profileImageUrl={user.profileImageUrl}
        online={user.online}
        className="shrink-0"
      />

      <div className="flex flex-1 break-all">
        <div className="flex flex-1 flex-col">
          <p
            className={cn(
              "line-clamp-1",
              selected
                ? "text-damul-main-500 dark:text-damul-main-50"
                : "text-black dark:text-white",
            )}>
            {user.nickname}
          </p>
          {user.online !== undefined && (
            <p
              className={cn(
                "line-clamp-1 text-xs",
                user.online
                  ? "text-green-400"
                  : "text-neutral-400 dark:text-neutral-200",
              )}>
              {user.online ? "온라인" : "오프라인"}
            </p>
          )}
        </div>

        {children && (
          <div className="flex shrink-0 items-center gap-3">{children}</div>
        )}
      </div>
    </div>
  );
};

export default UserItem;
