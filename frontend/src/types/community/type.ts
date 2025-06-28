import type { UserInfo } from "@/types/user/type";

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
export interface FriendListResponse {
  userId: number;
  nickname: string;
  profileImageUrl: string;
  online: boolean;
}

export interface FriendSearchResponse {
  data: UserInfo[];
  meta: {
    nextCursor: string;
    hasNext: boolean;
  };
}
