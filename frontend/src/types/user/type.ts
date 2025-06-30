export interface User {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  online?: boolean;
}
