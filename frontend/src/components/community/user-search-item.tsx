import { Link } from "react-router-dom";

import type { User } from "@/types/community/type";
import UserPortrait from "@/components/community/user-portrait";

interface UserSearchItemProps {
  user: User;
  keyword: string;
}

const UserSearchItem = ({ user, keyword }: UserSearchItemProps) => {
  return (
    <Link
      to={`/profiles/${user.userId}`}
      onMouseDown={(e) => e.preventDefault()}
      className="flex cursor-pointer items-center gap-3 rounded-md bg-white px-2 py-1 hover:bg-neutral-50">
      <UserPortrait profileImageUrl={user.profileImageUrl} className="size-5" />
      <div>
        <span className="text-damul-main-300">{keyword}</span>
        {user.nickname.substring(keyword.length)}
      </div>
    </Link>
  );
};

export default UserSearchItem;
