import type { User } from "@/types/community/type";
import type { InfiniteScrollType } from "@/types/common/type";

export enum ChatCreateStep {
  SELECT_USER,
  WRITE_TITLE,
  LENGTH,
}

export interface ChatCreateInfo {
  roomName: string;
  selectedUsers: User[];
}

export interface ChatRoomPreview {
  roomId: number;
  roomName: string;
  roomSize: number;
  profileImages: string[];
  lastMessage: string;
  lastMessageTime: string;
  unReadMessageCount: number;
}

export interface ChatRoom {
  roomName: string;
  roomSize: number;
  roomMembers: {
    userId: number;
    nickname: string;
    profileImageUrl: string;
    lastReadAt: string;
  }[];
}

export interface ChatRoomMember {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  lastReadAt: string;
}

export type MessageType = "TEXT" | "IMAGE" | "VIDEO";

export interface Message {
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

export interface optimisticMessage {
  id: number;
  objectUrl?: string;
  createdAt: string;
}

// Request ==========================================================================================================================
export interface CreateChatRoomRequest {
  roomName?: string;
  userIds: number[];
}

export interface ReadMessageRequest {
  roomId: number;
  lastReadAt: string;
}

export interface MessagesRequest {
  roomId: number;
  cursor?: string;
  size?: number;
}

export interface SearchMessageRequest {
  roomId: number;
  keyword: string;
  size?: number; // 50 ~ 100
}

// Response ==========================================================================================================================
export type ChatRoomPreviewsResponse = ChatRoomPreview[];

export type ChatRoomResponse = ChatRoom;

export type MessagesResponse = InfiniteScrollType<Message>;

export interface SearchMessageResponse {
  results: {
    messageId: number;
    sendTime: string;
    content: string;
  }[];
}
