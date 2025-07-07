import type { Client } from "@stomp/stompjs";

export interface WsState {
  client: Client | null;
  isConnected: boolean;
}

export type NotificationType =
  | "CHAT_NOTI"
  | "CHAT_MESSAGE"
  | "FRIEND_REQUEST"
  | "FRIEND_REQUEST_CANCEL"
  | "ONLINE_STATUS";

export interface WsResponse<T> {
  type: NotificationType;
  data: T;
}

export interface UserStatus {
  userId: number;
  online: boolean;
}
