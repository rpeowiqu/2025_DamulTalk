import type { MouseEvent } from "react";

import CheckCircleIcon from "@/components/icon/check-circle-icon";

const FriendAcceptButton = () => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log("친구 요청 수락함");
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
