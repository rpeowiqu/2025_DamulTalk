import type { MouseEvent } from "react";

import CancelCircleIcon from "@/components/icon/cancel-circle-icon";
import useRejectFriendRequest from "@/hooks/community/use-reject-friend-request";

interface FriendRejectButtonProps {
  userId: number;
}

const FriendRejectButton = ({ userId }: FriendRejectButtonProps) => {
  const { mutate: rejectRequest } = useRejectFriendRequest(userId);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    rejectRequest(userId);
  };

  return (
    <button
      onClick={handleClick}
      className="cursor-pointer text-red-400 transition-colors duration-200 hover:text-red-500">
      <CancelCircleIcon />
    </button>
  );
};

export default FriendRejectButton;
