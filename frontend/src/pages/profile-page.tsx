import { useParams } from "react-router-dom";

import ProfileContent from "@/components/community/profile-content";
import ProfileHeader from "@/components/community/profile-header";
import useProfile from "@/hooks/community/use-profile";
import ProfileHeaderSkeleton from "@/components/community/profile-header-skeleton";
import ProfileContentSkeleton from "@/components/community/profile-content-skeleton";

const ProfilePage = () => {
  const { userId } = useParams();
  const { data, isLoading, isRefetching } = useProfile(Number(userId));

  return (
    <div className="flex h-full flex-col gap-12 overflow-y-scroll p-6">
      {isLoading ? (
        <>
          <ProfileHeaderSkeleton />
          <ProfileContentSkeleton />
        </>
      ) : data ? (
        <>
          <ProfileHeader profile={data} isRefetching={isRefetching} />
          <ProfileContent profile={data} />
        </>
      ) : null}
    </div>
  );
};

export default ProfilePage;
