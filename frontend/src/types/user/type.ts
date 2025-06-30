export interface User {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  online?: boolean;
}

export interface Profile {
  nickname: string;
  profileImageUrl: string;
  statusMessage: string;
  friendCount: number;
  joinedAt: string;
  isFriend: "ACCEPTED" | "PENDING" | "ME" | "NONE";
}
