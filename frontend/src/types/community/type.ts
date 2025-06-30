import type { User } from "@/types/user/type";

// Request ==========================================================================================================================
export interface FollowRequest {
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
export type FriendListResponse = User[];

export interface FriendSearchResponse {
  data: User[];
  meta: {
    nextCursor: string;
    hasNext: boolean;
  };
}

export type FriendRequestListResponse = User[];
