import apiClient from "@/utils/http-common";
import type {
  DeleteFriendRequest,
  UserSearchRequest,
  RequestFriendRequest,
  UpdateProfileRequest,
} from "@/types/community/type";
import { getQueryString } from "@/utils/url";

// 온라인/오프라인 친구 목록 조회
export const getFriends = async (userId: number) => {
  const response = await apiClient.get(`friends/${userId}`);
  return response;
};

// 친구 요청 목록 조회
export const getFriendRequests = async () => {
  const response = await apiClient.get("friends/requests");
  return response;
};

// 친구 추가 요청
export const postFriendRequest = async (request: RequestFriendRequest) => {
  const response = await apiClient.post("friends/requests", {
    json: request,
  });
  return response;
};

// 친구 추가 요청 수락
export const patchAcceptFriendRequest = async (
  request: RequestFriendRequest,
) => {
  const response = await apiClient.patch("friends/requests", {
    json: request,
  });
  return response;
};

// 친구 추가 요청 취소/거절
export const deleteFriendRequest = async (userId: number) => {
  const response = await apiClient.delete(`friends/${userId}`);
  return response;
};

// 유저 검색
export const getUserSearch = async (request: UserSearchRequest) => {
  const queryString = getQueryString(request);
  const response = await apiClient.get(`users/search?${queryString}`);
  return response;
};

// 친구 삭제
export const deleteFriend = async (request: DeleteFriendRequest) => {
  const response = await apiClient.delete("friends", {
    json: request,
  });
  return response;
};

// 프로필 정보 조회
export const getProfile = async (userId: number) => {
  const response = await apiClient.get(`users/profiles/${userId}`);
  return response;
};

// 프로필 정보 수정
export const putUpdateProfile = async (request: UpdateProfileRequest) => {
  const jsonBlob = new Blob(
    [
      JSON.stringify({
        nickname: request.profileSetting.nickname,
        statusMessage: request.profileSetting.statusMessage,
        isDefaultBackground: request.profileSetting.isDefaultBackground,
        isDefaultProfile: request.profileSetting.isDefaultProfile,
      }),
    ],
    { type: "application/json" },
  );

  const formData = new FormData();
  formData.append("profileUpdateRequest", jsonBlob);
  if (request.backgroundImage) {
    formData.append("backgroundImage", request.backgroundImage);
  }
  if (request.profileImage) {
    formData.append("profileImage", request.profileImage);
  }

  const response = await apiClient.put(`users/profiles/${request.userId}`, {
    body: formData,
  });
  return response;
};
