import type { MouseEvent } from "react";

import CheckCircleIcon from "@/components/icon/check-circle-icon";
import useAcceptFriendRequest from "@/hooks/community/use-accept-friend-request";

interface FriendAcceptButtonProps {
  userId: number;
}

const FriendAcceptButton = ({ userId }: FriendAcceptButtonProps) => {
  const { mutate: acceptRequest } = useAcceptFriendRequest(userId);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    acceptRequest(userId);
  };

  return (
    <button
      onClick={handleClick}
      className="cursor-pointer text-green-400 transition-colors duration-200 hover:text-green-500">
      <CheckCircleIcon />
    </button>
  );
};

export default FriendAcceptButton;
