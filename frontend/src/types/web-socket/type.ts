import type { Client } from "@stomp/stompjs";

import type { MessageType } from "@/types/chat/type";

export interface WsState {
  client: Client | null;
  isConnected: boolean;
}

export interface WsDispatch {
  publishMessage: <T>(_dest: string, _body: T) => void;
}

export type NotificationType =
  | "CHAT_NOTI"
  | "CHAT_MESSAGE"
  | "CHAT_SYSTEM_MESSAGE"
  | "READ_TIME"
  | "FRIEND_REQUEST"
  | "FRIEND_REQUEST_CANCEL"
  | "FRIEND_ACCEPT"
  | "FRIEND_DELETE"
  | "ONLINE_STATUS";

export interface WsResponse<T> {
  type: NotificationType;
  data: T;
}

export interface UserStatus {
  userId: number;
  online: boolean;
}

// Request ==========================================================================================================================
export interface WsMessageRequest {
  roomId: number;
  senderId: number;
  messageType: MessageType;
  content: string;
  clientId: string;
}

export interface WsReadRequest {
  userId: number;
  lastReadAt: string;
}

// Response ==========================================================================================================================
export interface WsChatRoomPreviewResponse {
  roomId: number;
  profileImageUrl: string;
  nickname: string;
  messageType: MessageType;
  content: string;
  sendTime: string;
}

export interface WsChatRoomReadResponse {
  userId: number;
  lastReadAt: string;
}
