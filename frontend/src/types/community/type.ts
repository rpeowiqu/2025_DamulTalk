import type { InfiniteScrollType } from "@/types/common/type";

export interface User {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  online?: boolean;
}

export type FriendRequestType =
  | "ACCEPTED"
  | "PENDING_REQUEST"
  | "PENDING_RESPONSE"
  | "ME"
  | "NONE";

export interface Profile {
  nickname: string;
  profileImageUrl: string;
  backgroundImageUrl: string;
  statusMessage: string;
  friendCount: number;
  joinedAt: string;
  isFriend: FriendRequestType;
}

export interface ProfileSetting {
  nickname: string;
  statusMessage: string;
}

// Request ==========================================================================================================================
export interface RequestFriendRequest {
  id: number;
}

export interface UserSearchRequest {
  nickname: string;
  cursor?: string;
  size?: number;
}

export interface DeleteFriendRequest {
  id: number;
}

export interface UpdateProfileRequest {
  userId: number;
  nickname: string;
  statusMesasge: string;
  backgroundImage: File | null;
  profileImage: File | null;
}

// Response ==========================================================================================================================
export type FriendsResponse = User[];

export type FriendSearchResponse = InfiniteScrollType<User>;

export type FriendRequestsResponse = User[];

export type ProfileResponse = Profile;
