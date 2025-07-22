import {
  useMemo,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import { EditIcon } from "lucide-react";
import { debounce } from "lodash-es";

import { cn } from "@/utils/style";
import defaultProfileBackground from "@/assets/images/profile-background.png";
import UserPortrait from "@/components/community/user-portrait";
import Input from "@/components/common/input";
import FileUploadButton from "@/components/common/file-upload-button";
import type { Profile, ProfileSetting } from "@/types/community/type";
import type { UploadFile } from "@/types/chat/type";
import useCheckNicknameDuplication from "@/hooks/auth/use-check-nickname-duplication";

interface ProfileSettingHeaderProps {
  profile: Profile;
  formData: ProfileSetting;
  setFormData: Dispatch<SetStateAction<ProfileSetting>>;
  backgroundImageFile: UploadFile | null;
  setBackgroundImageFile: Dispatch<SetStateAction<UploadFile | null>>;
  profileImageFile: UploadFile | null;
  setProfileImageFile: Dispatch<SetStateAction<UploadFile | null>>;
}

const ProfileSettingHeader = ({
  profile,
  formData,
  setFormData,
  backgroundImageFile,
  setBackgroundImageFile,
  profileImageFile,
  setProfileImageFile,
}: ProfileSettingHeaderProps) => {
  const [isHoverBackground, setIsHoverBackground] = useState(false);
  const [isHoverProfile, setIsHoverProfile] = useState(false);

  const { messageType, message } = useCheckNicknameDuplication(
    formData.nickname,
  );

  const updateFormData = useMemo(
    () =>
      debounce((nickname: string) => {
        setFormData((prev) => ({
          ...prev,
          nickname,
        }));
      }, 400),
    [],
  );

  const handleChangeNickname = (e: ChangeEvent<HTMLInputElement>) => {
    updateFormData(e.target.value);
  };

  return (
    <div>
      <div
        className="relative h-54 overflow-hidden rounded-xl"
        onMouseEnter={() => setIsHoverBackground(true)}
        onMouseLeave={() => setIsHoverBackground(false)}>
        <img
          src={
            backgroundImageFile?.objectUrl ??
            profile.backgroundImageUrl ??
            defaultProfileBackground
          }
          alt="프로필 배경"
          className={cn(
            "size-full object-cover transition-transform duration-300",
            isHoverBackground && "scale-105",
          )}
        />

        {isHoverBackground && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
            <FileUploadButton
              type="button"
              uploadFile={backgroundImageFile}
              setUploadFile={setBackgroundImageFile}
              className="text-damul-main-300 flex cursor-pointer flex-col items-center justify-center gap-1 font-bold">
              <EditIcon />
              <p>수정하기</p>
            </FileUploadButton>
          </div>
        )}
      </div>

      <div className="flex h-16 justify-between px-10">
        <div className="flex items-end gap-4">
          <div
            className="relative overflow-hidden rounded-full"
            onMouseEnter={() => setIsHoverProfile(true)}
            onMouseLeave={() => setIsHoverProfile(false)}>
            <UserPortrait
              className={cn(
                "size-28 border-2 transition-transform duration-300",
                isHoverProfile && "scale-105",
              )}
              profileImageUrl={
                profileImageFile?.objectUrl ?? profile.profileImageUrl
              }
            />

            {isHoverProfile && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                <FileUploadButton
                  type="button"
                  uploadFile={profileImageFile}
                  setUploadFile={setProfileImageFile}
                  className="text-damul-main-300 flex cursor-pointer flex-col items-center justify-center gap-1 font-bold">
                  <EditIcon />
                  <p>수정하기</p>
                </FileUploadButton>
              </div>
            )}
          </div>

          <div className="relative w-80">
            <Input
              defaultValue={formData.nickname}
              className={cn(
                "w-full",
                messageType === "valid" || formData.nickname.length === 0
                  ? "focus:ring-damul-main-300"
                  : "focus:ring-red-400",
              )}
              maxLength={12}
              onChange={handleChangeNickname}
            />

            <p
              className={cn(
                "absolute top-full left-0 mt-2 text-sm",
                messageType === "valid"
                  ? "text-damul-main-300"
                  : "text-red-400",
              )}>
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingHeader;
