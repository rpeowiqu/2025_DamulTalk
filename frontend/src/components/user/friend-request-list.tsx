import type { UserInfo } from "@/types/user/type";
import { cn } from "@/utils/style";
import FriendRequestItem from "@/components/user/friend-request-item";

interface FriendRequestListProps {
  userInfoList: UserInfo[];
  className?: string;
  onSelect?: (_user: UserInfo) => void;
}

const FriendRequestList = ({
  userInfoList,
  className,
  onSelect,
}: FriendRequestListProps) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {userInfoList.map((item) => (
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
