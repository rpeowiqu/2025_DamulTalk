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
    <header>
      <div className="h-54">
        <img
          src={profile.backgroundImageUrl ?? defaultProfileBackground}
          alt="프로필 배경"
          className="size-full rounded-xl object-cover"
        />
      </div>

      <div className="flex h-16 justify-between px-10">
        <div className="flex items-end gap-4">
          <UserPortrait
            className="size-28"
            profileImageUrl={profile.profileImageUrl}
          />

          <div>
            <h1 className="text-2xl font-bold">{profile.nickname}</h1>
            <p className="text-neutral-500">
              <span className="font-bold text-black">
                {profile.friendCount}
              </span>{" "}
              친구
            </p>
          </div>
        </div>

        {/* 리패칭 중에는 버튼이 언마운트되도록 만들어, 리패칭 후에도 isFriend 값이 같더라도 initState를 초기값으로 되돌릴 수 있도록 설계 */}
        {/* key 값을 추가하여 다른 유저의 프로필 조회 시 강제로 리마운트 되도록 설계 */}
        {!isRefetching && (
          <div className="self-center">
            <FriendRequestButton
              key={profile.nickname}
              isFriend={profile.isFriend}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default ProfileHeader;
