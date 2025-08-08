import type { MouseEvent } from "react";

import useLogout from "@/hooks/auth/use-logout";

const LogoutButton = () => {
  const { mutate: logout } = useLogout();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    logout();
  };

  return (
    <button
      className="shrink-0 cursor-pointer text-xs text-neutral-300 dark:text-neutral-100"
      onClick={handleClick}>
      로그아웃
    </button>
  );
};

export default LogoutButton;
