import { useMutation, useQueryClient } from "@tanstack/react-query";

import { putUpdateProfile } from "@/services/community/api";
import type {
  ProfileResponse,
  UpdateProfileRequest,
  User,
} from "@/types/community/type";

const useUpdateProfile = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-profile", userId],
    mutationFn: (request: UpdateProfileRequest) => putUpdateProfile(request),
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
    },
  });
};

export default useUpdateProfile;
