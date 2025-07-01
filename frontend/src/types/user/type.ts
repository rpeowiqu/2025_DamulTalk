export interface User {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  online?: boolean;
}

export type FriendRequestType = "ACCEPTED" | "PENDING" | "ME" | "NONE";

export interface Profile {
  nickname: string;
  profileImageUrl: string;
  statusMessage: string;
  friendCount: number;
  joinedAt: string;
  isFriend: FriendRequestType;
}
