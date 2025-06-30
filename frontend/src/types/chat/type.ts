import type { User } from "@/types/user/type";

export enum ChatCreateStep {
  SELECT_USER,
  WRITE_TITLE,
  LENGTH,
}

export interface ChatCreateInfo {
  title: string;
  selectedUsers: User[];
}

export interface ChatRoomInfo {
  roomName: string;
  roomSize: number;
  profileImages: string[];
  members: ChatRoomMember[];
}

export interface ChatRoomMember {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
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
  objectUrl?: string;
}

export interface OptChatMessageInfo {
  id: number;
  objectUrl?: string;
  createdAt: string;
}
