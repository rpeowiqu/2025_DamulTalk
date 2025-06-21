import type { UserInfo } from "@/types/user/type";

export enum ChatCreateStep {
  SELECT_USER,
  WRITE_TITLE,
  LENGTH,
}

export interface ChatCreateInfo {
  title: string;
  selectedUsers: UserInfo[];
}

export interface ChatRoomInfo {
  roomName: string;
  roomSize: number;
  profileImages: string[];
  members: ChatRoomMember[];
}

export interface ChatRoomMember {
  userInfo: UserInfo;
  lastReadAt: string;
}
