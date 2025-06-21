import defaultProfileBackground from "@/assets/images/profile-background.png";
import UserPortrait from "@/components/user/user-portrait";

const ProfileHeader = () => {
  return (
    <div>
      <div className="h-54">
        <img
          src={defaultProfileBackground}
          alt="프로필 배경"
          className="size-full rounded-xl object-cover"
        />
      </div>

      <div className="flex h-16 items-end gap-4 px-10">
        <UserPortrait className="size-28" />

        <div>
          <h1 className="text-2xl font-bold">일이삼사오육칠팔구십십일</h1>
          <p className="text-neutral-500">
            <span className="font-bold text-black">283</span> 친구
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
