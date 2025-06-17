import { Link } from "react-router-dom";

import UserPortrait from "@/components/user/user-portrait";
import { cn } from "@/utils/style";

interface UserItemProps {
  userId: number;
  nickname: string;
  profileImageUrl?: string;
  online?: boolean;
  className?: string;
}

const UserItem = ({
  userId,
  nickname,
  profileImageUrl,
  online,
  className,
}: UserItemProps) => {
  return (
    <Link
      to={`/profile/${userId}`}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 rounded-xl bg-white p-2 hover:bg-neutral-50",
        className,
      )}>
      <UserPortrait
        profileImageUrl={profileImageUrl}
        online={online}
        className="shrink-0"
      />

      <div className="flex flex-1 flex-col break-all">
        <p className="line-clamp-1">{nickname}</p>
        {online !== undefined && (
          <p
            className={cn(
              "line-clamp-1 text-xs",
              online ? "text-green-400" : "text-neutral-400",
            )}>
            {online ? "온라인" : "오프라인"}
          </p>
        )}
      </div>
    </Link>
  );
};

export default UserItem;
