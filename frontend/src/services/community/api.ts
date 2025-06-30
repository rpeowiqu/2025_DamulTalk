import apiClient from "@/utils/http-common";
import {
  type FriendRequestRequest,
  type FriendDeleteRequest,
  type FriendSearchRequest,
  type FriendSearchResponse,
  type ProfileResponse,
} from "@/types/community/type";
import { getQueryString } from "@/utils/url";

export const getFriends = async (userId: number) => {
  const response = await apiClient.get(`friends/${userId}`);
  return response;
};

export const postFriendRequest = async (request: FriendRequestRequest) => {
  const response = await apiClient.post("friends/requests", {
    json: request,
  });
  return response;
};

export const getFriendSearch = async (request: FriendSearchRequest) => {
  const query = getQueryString(request);
  const data = await apiClient
    .get(`friends/search?${query}`)
    .json<FriendSearchResponse>();
  return data;
};

export const deleteFriend = async (request: FriendDeleteRequest) => {
  const response = await apiClient.delete("friends", {
    json: request,
  });
  return response;
};

export const getFriendRequests = async () => {
  const response = await apiClient.get("friends/requests");
  return response;
};

export const getProfile = async (userId: number) => {
  const data = await apiClient
    .get(`users/profiles/${userId}`)
    .json<ProfileResponse>();
  return data;
};
