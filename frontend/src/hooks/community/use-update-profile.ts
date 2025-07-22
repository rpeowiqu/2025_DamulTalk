import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { putUpdateProfile } from "@/services/community/api";
import type {
  ProfileResponse,
  UpdateProfileRequest,
  User,
} from "@/types/community/type";
import { handleJsonResponse } from "@/utils/http-common";

const useUpdateProfile = (userId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["update-profile", userId],
    mutationFn: async (request: UpdateProfileRequest) => {
      const response = await putUpdateProfile(request);
      return await handleJsonResponse<ProfileResponse>(response);
    },
    onSuccess: (data, request) => {
      // 내 프로필을 갱신
      queryClient.setQueryData<ProfileResponse>(
        ["profile", request.userId],
        (prev) => (prev ? data : prev),
      );

      // 사이드 바에서 프로필을 갱신
      queryClient.setQueryData<User>(["current-user"], (prev) =>
        prev
          ? {
              ...prev,
              nickname: data.nickname,
              profileImageUrl: data.profileImageUrl,
            }
          : prev,
      );

      // 프로필 페이지로 이동
      navigate(`/profiles/${request.userId}`);
      toast.success("프로필이 수정되었어요");
    },
  });
};

export default useUpdateProfile;
