import { useEffect, useRef, useState } from "react";

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

  const [formData, setFormData] = useState<ProfileSetting>({
    nickname: "",
    statusMessage: "",
    isDefaultBackground: false,
    isDefaultProfile: false,
  });
  const nicknameInputRef = useRef<HTMLInputElement>(null);
  const [backgroundImageFile, setBackgroundImageFile] =
    useState<UploadFile | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<UploadFile | null>(
    null,
  );
  const { mutate: updateProfile } = useUpdateProfile(Number(user?.userId));

  const handleReset = () => {
    if (!data || !nicknameInputRef.current) {
      return;
    }

    setFormData({
      nickname: data.nickname,
      statusMessage: data.statusMessage ?? "",
      isDefaultBackground: !data.backgroundImageUrl,
      isDefaultProfile: !data.profileImageUrl,
    });
    nicknameInputRef.current.value = data.nickname;
    console.log(nicknameInputRef.current.value);
    setBackgroundImageFile(null);
    setProfileImageFile(null);
  };

  const handleSubmit = () => {
    if (!user) {
      return;
    }

    updateProfile({
      userId: user.userId,
      profileSetting: formData,
      backgroundImage: backgroundImageFile?.file ?? null,
      profileImage: profileImageFile?.file ?? null,
    });
  };

  useEffect(() => {
    handleReset();
  }, [data]);

  return (
    <div className="flex h-full flex-col gap-12 overflow-y-scroll p-6">
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
            nicknameInputRef={nicknameInputRef}
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
