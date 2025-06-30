import type { Profile, User } from "@/types/user/type";

// Request ==========================================================================================================================
export interface FriendRequestRequest {
  id: number;
}

export interface FriendSearchRequest {
  nickname: string;
  cursor?: string;
  size?: number;
}
export interface FriendDeleteRequest {
  id: number;
}

// Response ==========================================================================================================================
export type FriendsResponse = User[];

export interface FriendSearchResponse {
  data: User[];
  meta: {
    nextCursor: string;
    hasNext: boolean;
  };
}

export type FriendRequestsResponse = User[];

export type ProfileResponse = Profile;
