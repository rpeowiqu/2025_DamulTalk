import type { MouseEvent } from "react";

import CancelCircleIcon from "@/components/icon/cancel-circle-icon";

const FriendRejectButton = () => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log("친구 요청 거절함");
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
