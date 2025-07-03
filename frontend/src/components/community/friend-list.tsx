import type { User } from "@/types/user/type";
import { cn } from "@/utils/style";
import UserItem from "@/components/community/user-item";
import UserItemSkeleton from "@/components/community/user-item-skeleton";

interface FriendListProps {
  isLoading: boolean;
  users: User[];
  visibleStatus: boolean;
  className?: string;
  selectedUsers?: User[];
  onSelect?: (_user: User) => void;
}

const FriendList = ({
  isLoading,
  users,
  visibleStatus,
  className,
  selectedUsers,
  onSelect,
}: FriendListProps) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {isLoading
        ? Array.from({ length: 6 }).map((_, index) => (
            <UserItemSkeleton key={index} visibleStatus={true} />
          ))
        : users.map((item) => {
            const selected =
              selectedUsers &&
              selectedUsers.some((u) => u.userId === item.userId);

            return (
              <UserItem
                key={item.userId}
                user={{
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
