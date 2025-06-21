import type { MouseEvent } from "react";

const LogoutButton = () => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log("로그아웃 되었습니다.");
  };

  return (
    <button
      className="shrink-0 cursor-pointer text-xs text-neutral-300"
      onClick={handleClick}>
      로그아웃
    </button>
  );
};

export default LogoutButton;
