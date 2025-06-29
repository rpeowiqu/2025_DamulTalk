import type { UserInfo } from "@/types/user/type";
import { cn } from "@/utils/style";
import UserItem from "@/components/user/user-item";
import UserItemSkeleton from "@/components/user/user-item-skeleton";

interface FriendListProps {
  isLoading: boolean;
  userInfoList: UserInfo[];
  visibleStatus: boolean;
  className?: string;
  selectedList?: UserInfo[];
  onSelect?: (_user: UserInfo) => void;
}

const FriendList = ({
  isLoading,
  userInfoList,
  visibleStatus,
  className,
  selectedList,
  onSelect,
}: FriendListProps) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {isLoading
        ? Array.from({ length: 6 }).map((_, index) => (
            <UserItemSkeleton key={index} />
          ))
        : userInfoList.map((item) => {
            const selected =
              selectedList &&
              selectedList.some((u) => u.userId === item.userId);

            return (
              <UserItem
                key={item.userId}
                userInfo={{
                  ...item,
                  online: visibleStatus ? item.online : undefined,
                }}
                selected={selected}
                onClick={() => onSelect?.(item)}
              />
            );
          })}
    </div>
  );
};

export default FriendList;
