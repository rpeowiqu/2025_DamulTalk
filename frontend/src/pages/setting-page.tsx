import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import type { ProfileSetting } from "@/types/community/type";
import useCurrentUser from "@/hooks/auth/use-current-user";
import useProfile from "@/hooks/community/use-profile";
import ProfileContentSkeleton from "@/components/community/profile-content-skeleton";
import ProfileHeaderSkeleton from "@/components/community/profile-header-skeleton";
import ProfileSettingHeader from "@/components/community/profile-setting-header";
import ProfileSettingContent from "@/components/community/profile-setting-cotent";
import type { UploadFile } from "@/types/chat/type";
import useUpdateProfile from "@/hooks/community/use-update-profile";

const SettingPage = () => {
  const { data: user } = useCurrentUser();
  const { data, isLoading } = useProfile(Number(user?.userId));

  const { mutate: updateProfile } = useUpdateProfile(Number(user?.userId));
  const [formData, setFormData] = useState<ProfileSetting>({
    nickname: "",
    statusMessage: "",
  });
  const [backgroundImageFile, setBackgroundImageFile] =
    useState<UploadFile | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<UploadFile | null>(
    null,
  );

  const navigate = useNavigate();

  const handleReset = () => {
    if (!data) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      nickname: data.nickname,
      statusMessage: data.statusMessage ?? "",
    }));
    setBackgroundImageFile(null);
    setProfileImageFile(null);
  };

  const handleSubmit = () => {
    if (!user) {
      return;
    }

    updateProfile({
      userId: user.userId,
      nickname: formData.nickname,
      statusMesasge: formData.statusMessage,
      backgroundImage: backgroundImageFile?.file ?? null,
      profileImage: profileImageFile?.file ?? null,
    });

    // 프로필 페이지로 이동
    navigate(`/profiles/${user.userId}`);
    toast.success("프로필이 수정되었어요");
  };

  useEffect(() => {
    handleReset();
  }, [data]);

  return (
    <div className="flex h-full flex-col gap-12 overflow-y-scroll bg-white p-6">
      {isLoading ? (
        <>
          <ProfileHeaderSkeleton />
          <ProfileContentSkeleton />
        </>
      ) : data ? (
        <>
          <ProfileSettingHeader
            profile={data}
            formData={formData}
            setFormData={setFormData}
            backgroundImageFile={backgroundImageFile}
            setBackgroundImageFile={setBackgroundImageFile}
            profileImageFile={profileImageFile}
            setProfileImageFile={setProfileImageFile}
          />
          <ProfileSettingContent
            profile={data}
            formData={formData}
            setFormData={setFormData}
            onReset={handleReset}
            onSubmit={handleSubmit}
          />
        </>
      ) : null}
    </div>
  );
};

export default SettingPage;
