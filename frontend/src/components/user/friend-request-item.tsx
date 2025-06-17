import { useNavigate } from "react-router-dom";

import { cn } from "@/utils/style";
import UserPortrait from "@/components/user/user-portrait";
import FriendAcceptButton from "@/components/user/friend-accept-button";
import FriendRejectButton from "@/components/user/friend-reject-button";

interface FriendRequestItemProps {
  userId: number;
  nickname: string;
  profileImageUrl?: string;
  className?: string;
}

const FriendRequestItem = ({
  userId,
  nickname,
  profileImageUrl,
  className,
}: FriendRequestItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 rounded-xl p-2 hover:bg-neutral-50",
        className,
      )}
      onClick={handleClick}>
      <div className="flex flex-1 items-center gap-3">
        <UserPortrait profileImageUrl={profileImageUrl} className="shrink-0" />
        <p className="line-clamp-1 break-all">{nickname}</p>
      </div>

      <div className="flex items-center gap-2">
        <FriendAcceptButton />
        <FriendRejectButton />
      </div>
    </div>
  );
};

export default FriendRequestItem;
