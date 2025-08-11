import type { Profile } from "@/types/community/type";
import defaultProfileBackground from "@/assets/images/profile-background.png";
import UserPortrait from "@/components/community/user-portrait";
import FriendRequestButton from "@/components/community/friend-request-button";

interface ProfileHeaderProps {
  profile: Profile;
  isRefetching: boolean;
}

const ProfileHeader = ({ profile, isRefetching }: ProfileHeaderProps) => {
  return (
    <header className="flex flex-col gap-6">
      <div>
        <div className="h-36 md:h-54">
          <img
            src={profile.backgroundImageUrl ?? defaultProfileBackground}
            alt="프로필 배경"
            className="size-full rounded-xl object-cover"
          />
        </div>

        <div className="flex h-12 justify-between px-6 md:h-16 md:px-10">
          <div className="flex items-end gap-4">
            <UserPortrait
              className="size-16 shrink-0 border-2 md:size-28"
              profileImageUrl={profile.profileImageUrl}
            />

            <div className="break-all">
              <h1 className="line-clamp-1 text-lg font-bold md:text-2xl dark:text-white">
                {profile.nickname}
              </h1>
              <p className="text-sm text-neutral-500 md:text-base dark:text-neutral-200">
                <span className="font-bold text-black dark:text-white">
                  {profile.friendCount}
                </span>{" "}
                친구
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end">
        {/* 리패칭 중에는 버튼이 언마운트되도록 만들어, 리패칭 후에도 isFriend 값이 같더라도 initState를 초기값으로 되돌릴 수 있도록 설계 */}
        {/* key 값을 추가하여 다른 유저의 프로필 조회 시 강제로 리마운트 되도록 설계 */}
        {!isRefetching && (
          <FriendRequestButton
            key={profile.nickname}
            isFriend={profile.isFriend}
          />
        )}
      </div>
    </header>
  );
};

export default ProfileHeader;
