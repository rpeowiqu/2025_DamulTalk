import ProfileContent from "@/components/profile/profile-content";
import ProfileHeader from "@/components/profile/profile-header";

const ProfilePage = () => {
  return (
    <div className="flex h-dvh flex-col gap-12 bg-white p-6">
      <ProfileHeader />
      <ProfileContent />
    </div>
  );
};

export default ProfilePage;
