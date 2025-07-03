import type { User } from "@/types/community/type";
import { cn } from "@/utils/style";
import FriendRequestItem from "@/components/community/friend-request-item";
import FriendRequestItemSkeleton from "@/components/community/friend-request-item-skeleton";

interface FriendRequestListProps {
  isLoading: boolean;
  users: User[];
  className?: string;
  onSelect?: (_user: User) => void;
}

const FriendRequestList = ({
  isLoading,
  users,
  className,
  onSelect,
}: FriendRequestListProps) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <FriendRequestItemSkeleton key={index} />
          ))
        : users.map((item) => (
            <FriendRequestItem
              key={item.userId}
              user={{ ...item, online: undefined }}
              onClick={() => onSelect?.(item)}
            />
          ))}
    </div>
  );
};

export default FriendRequestList;
