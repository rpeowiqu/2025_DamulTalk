import apiClient from "@/utils/http-common";
import type {
  FollowRequest,
  FriendDeleteRequest,
  FriendListResponse,
  FriendSearchRequest,
  FriendSearchResponse,
} from "@/types/community/type";
import { getQueryString } from "@/utils/url";

export const getFriends = async () => {
  const data = await apiClient.get("/friends").json<FriendListResponse>();
  return data;
};

export const postFollow = async (request: FollowRequest) => {
  const response = await apiClient.post("/friends/requests", {
    json: request,
  });
  return response;
};

export const getFriendSearch = async (request: FriendSearchRequest) => {
  const query = getQueryString(request);
  const data = await apiClient
    .get(`/friends/search?${query}`)
    .json<FriendSearchResponse>();
  return data;
};

export const deleteFriend = async (request: FriendDeleteRequest) => {
  const response = await apiClient.delete("/friends", {
    json: request,
  });
  return response;
};
