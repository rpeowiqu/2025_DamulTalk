import UserPortrait from "@/components/user/UserPortrait";
import { cn } from "@/utils/style";

interface UserItemProps {
  nickname: string;
  online?: boolean;
  className?: string;
}

const UserItem = ({ nickname, online, className }: UserItemProps) => {
  return (
    <div className={cn("flex w-full items-center gap-3", className)}>
      <UserPortrait online={online} />

      <div className="flex flex-col">
        <p>{nickname}</p>
        {online !== undefined && (
          <p
            className={cn(
              "text-xs",
              online ? "text-green-400" : "text-neutral-400",
            )}>
            {online ? "온라인" : "오프라인"}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserItem;
