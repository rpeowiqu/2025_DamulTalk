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
  profileImageUrls: string[];
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
export type MessageStatus = "SENDING" | "SENT" | "FAILED";

export interface Message {
  messageId: string;
  senderId: number;
  profileImageUrl: string;
  nickname: string;
  messageStatus: MessageStatus;
  messageType: MessageType;
  content: string;
  fileUrl?: string;
  sendTime: string;
  unReadCount: number;
  clientId?: string;
}

export interface MessageTransferHistory {
  objectUrl?: string;
  sendTime: string;
}

export type SystemMessageType = "DATE" | "EXIT";

export interface SystemMessage {
  type: SystemMessageType;
  messageId: number;
  content: string;
  leftUserId?: number;
}

export interface UploadFile {
  file: File;
  objectUrl?: string;
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

export interface SendFileRequest {
  roomId: number;
  file: File;
  clientId: string;
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
