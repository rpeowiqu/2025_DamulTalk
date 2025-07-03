import type { Profile, User } from "@/types/user/type";
import type { InfiniteScrollType } from "@/types/common/type";

// Request ==========================================================================================================================
export interface FriendRequestRequest {
  id: number;
}

export interface UserSearchRequest {
  nickname: string;
  cursor?: string;
  size?: number;
}

export interface FriendDeleteRequest {
  id: number;
}

// Response ==========================================================================================================================
export type FriendsResponse = User[];

export type FriendSearchResponse = InfiniteScrollType<User>;

export type FriendRequestsResponse = User[];

export type ProfileResponse = Profile;
