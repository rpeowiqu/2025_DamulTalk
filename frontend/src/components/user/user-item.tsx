import type { MouseEvent, ReactNode } from "react";

import UserPortrait from "@/components/user/user-portrait";
import { cn } from "@/utils/style";
import type { User } from "@/types/user/type";

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
        "flex w-full cursor-pointer items-center gap-3 rounded-xl p-2 hover:bg-neutral-50",
        selected ? "bg-damul-main-50" : "bg-white",
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
              selected ? "text-damul-main-500" : "text-black",
            )}>
            {user.nickname}
          </p>
          {user.online !== undefined && (
            <p
              className={cn(
                "line-clamp-1 text-xs",
                user.online ? "text-green-400" : "text-neutral-400",
              )}>
              {user.online ? "온라인" : "오프라인"}
            </p>
          )}
        </div>

        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </div>
  );
};

export default UserItem;
