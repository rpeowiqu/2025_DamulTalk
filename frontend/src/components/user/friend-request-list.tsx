import type { UserInfo } from "@/types/user/type";
import { cn } from "@/utils/style";
import FriendRequestItem from "@/components/user/friend-request-item";
import FriendRequestItemSkeleton from "@/components/user/friend-request-item-skeleton";

interface FriendRequestListProps {
  isLoading: boolean;
  userInfoList: UserInfo[];
  className?: string;
  onSelect?: (_user: UserInfo) => void;
}

const FriendRequestList = ({
  isLoading,
  userInfoList,
  className,
  onSelect,
}: FriendRequestListProps) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <FriendRequestItemSkeleton key={index} />
          ))
        : userInfoList.map((item) => (
            <FriendRequestItem
              key={item.userId}
              userInfo={{ ...item, online: undefined }}
              onClick={() => onSelect?.(item)}
            />
          ))}
    </div>
  );
};

export default FriendRequestList;
