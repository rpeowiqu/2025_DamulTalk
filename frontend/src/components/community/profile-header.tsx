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
    <div>
      <div className="h-54">
        <img
          src={defaultProfileBackground}
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
        {!isRefetching && (
          <FriendRequestButton
            isFriend={profile.isFriend}
            className="self-center"
          />
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
