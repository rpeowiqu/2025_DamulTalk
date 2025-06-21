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

export interface ChatMessageInfo {
  messageId: number;
  senderId: number;
  profileImageUrl: string;
  nickname: string;
  messageType: string;
  content: string;
  fileUrl?: string;
  sentTime: string;
  unReadCount: number;
}
