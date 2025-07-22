import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";

import type { Profile, ProfileSetting } from "@/types/community/type";
import Button from "@/components/common/button";
import TextArea from "@/components/common/textarea";

interface ProfileSettingContentProps {
  profile: Profile;
  formData: ProfileSetting;
  setFormData: Dispatch<SetStateAction<ProfileSetting>>;
  onReset: () => void;
  onSubmit: () => void;
}

const ProfileSettingContent = ({
  profile,
  formData,
  setFormData,
  onReset,
  onSubmit,
}: ProfileSettingContentProps) => {
  const handleChangeStatusMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      statusMessage: e.target.value,
    }));
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="flex min-w-120 flex-1 flex-col gap-4">
        <h1 className="text-xl font-bold">상세 정보</h1>
        <ul className="flex min-h-0 flex-1 list-disc flex-col gap-4 pl-8">
          <li>
            <p className="font-bold">가입일</p>
            <p className="text-neutral-500">
              {new Date(profile.joinedAt).toLocaleDateString()}
            </p>
          </li>

          <li>
            <p className="font-bold">상태 메시지</p>
            <TextArea
              autoComplete="off"
              autoCapitalize="off"
              value={formData.statusMessage}
              placeholder="지금 어떤 상태인지 작성해 주세요"
              maxLength={500}
              onChange={handleChangeStatusMessage}
            />
          </li>
        </ul>
      </div>

      <motion.div
        className="sticky bottom-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}>
        <motion.div
          animate={{
            y: [0, -3, 0, 3, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}>
          <div className="border-damul-main-300 flex w-120 items-center justify-between rounded-xl border bg-white px-5 py-3 shadow-lg">
            <p className="text-damul-main-300 font-bold">
              프로필을 수정하고 있어요!
            </p>

            <div className="flex gap-3">
              <Button
                type="button"
                className="bg-neutral-300 py-2 text-base hover:bg-neutral-400"
                onClick={onReset}>
                되돌리기
              </Button>
              <Button
                type="button"
                className="py-2 text-base"
                onClick={onSubmit}>
                저장하기
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfileSettingContent;
