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

export interface WsMessageRequest {
  roomId: number;
  senderId: number;
  messageType: MessageType;
  content: string;
  clientId: string;
}
