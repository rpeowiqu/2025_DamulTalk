import { useNavigate, useParams } from "react-router-dom";

import SearchBar from "@/components/common/search-bar";
import FriendList from "@/components/community/friend-list";
import type { Profile, User } from "@/types/community/type";
import useFriends from "@/hooks/community/use-friends";

interface ProfileContentProps {
  profile: Profile;
}

const ProfileContent = ({ profile }: ProfileContentProps) => {
  const { userId } = useParams();
  const { data, isLoading: isLoadingFriends } = useFriends(
    userId ? Number(userId) : 0,
  );
  const navigate = useNavigate();

  return (
    <div className="flex min-h-0 flex-1 gap-4">
      <div className="flex min-w-120 flex-1 flex-col gap-4">
        <h1 className="text-xl font-bold">상세 정보</h1>
        <ul className="flex list-disc flex-col gap-4 pl-8">
          <li>
            <p className="font-bold">가입일</p>
            <p className="text-neutral-500">
              {new Date(profile.joinedAt).toLocaleDateString()}
            </p>
          </li>

          <li>
            <p className="font-bold">상태 메시지</p>
            <p className="whitespace-pre-wrap text-neutral-500">
              {profile.statusMessage}
            </p>
          </li>
        </ul>
      </div>

      <div className="h-full w-0.5 bg-neutral-50"></div>

      <div className="flex min-w-72 flex-col gap-4">
        <h1 className="text-xl font-bold">친구</h1>
        <SearchBar onSearch={(keyword) => console.log(keyword)} />
        <FriendList
          isLoading={isLoadingFriends}
          users={data ?? []}
          visibleStatus={false}
          className="scroll-hidden min-h-0 flex-1 overflow-y-auto"
          onSelect={(user: User) => navigate(`/profiles/${user.userId}`)}
        />
      </div>
    </div>
  );
};

export default ProfileContent;
