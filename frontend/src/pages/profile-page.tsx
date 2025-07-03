import { useParams } from "react-router-dom";

import ProfileContent from "@/components/community/profile-content";
import ProfileHeader from "@/components/community/profile-header";
import useProfile from "@/hooks/community/use-profile";
import ProfileHeaderSkeleton from "@/components/community/profile-header-skeleton";
import ProfileContentSkeleton from "@/components/community/profile-content-skeleton";

const ProfilePage = () => {
  const { userId } = useParams();
  const { data, isLoading } = useProfile(userId ? Number(userId) : 0);

  return (
    <div className="flex h-dvh flex-col gap-12 bg-white p-6">
      {isLoading ? (
        <>
          <ProfileHeaderSkeleton />
          <ProfileContentSkeleton />
        </>
      ) : data ? (
        <>
          <ProfileHeader profile={data} />
          <ProfileContent profile={data} />
        </>
      ) : null}
    </div>
  );
};

export default ProfilePage;
