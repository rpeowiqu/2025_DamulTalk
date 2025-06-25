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

export type MessageType = "TEXT" | "IMAGE" | "VIDEO";

export interface ChatMessageInfo {
  messageId: number;
  senderId: number;
  profileImageUrl: string;
  nickname: string;
  messageType: MessageType;
  content: string;
  fileUrl?: string;
  sentTime: string;
  unReadCount: number;
}

export interface UploadFile {
  file: File;
  thumbnailImageUrl: string;
}

export interface OptChatMessageInfo {
  id: number;
  objectUrl?: string;
  createdAt: string;
}
