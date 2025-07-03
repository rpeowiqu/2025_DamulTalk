import type {
  ChatRoomPreviewsResponse,
  ChatRoomResponse,
  CreateChatRoomRequest,
  MessagesRequest,
  ReadMessageRequest,
  SearchMessageRequest,
  SearchMessageResponse,
} from "@/types/chat/type";
import apiClient from "@/utils/http-common";
import { getQueryString } from "@/utils/url";

// 채팅 목록 조회
export const getChatRoomPreviews = async () => {
  const data = await apiClient.get("chats").json<ChatRoomPreviewsResponse>();
  return data;
};

// 새 채팅방 만들기
export const postCreateChatRoom = async (request: CreateChatRoomRequest) => {
  const response = await apiClient.post("chats", {
    json: request,
  });
  return response;
};

// 채팅방 정보 불러오기
export const getChatRoom = async (roomId: number) => {
  const data = await apiClient.get(`chats/${roomId}`).json<ChatRoomResponse>();
  return data;
};

// 채팅 내역 불러오기
export const getMessages = async (request: MessagesRequest) => {
  const { roomId, ...queryParams } = request;
  const queryString = getQueryString(queryParams);
  const response = await apiClient.get(
    `chats/${roomId}/messages?${queryString}`,
  );
  return response;
};

// 채팅방 나가기
export const deleteExitChatRoom = async (roomId: number) => {
  const response = await apiClient.delete(`chats/${roomId}`);
  return response;
};

// 키워드 검색
export const getSearchMessage = async (request: SearchMessageRequest) => {
  const { roomId, ...queryParams } = request;
  const queryString = getQueryString(queryParams);
  const data = await apiClient
    .get(`chats/${roomId}/search?${queryString}`)
    .json<SearchMessageResponse>();
  return data;
};

// 메시지 읽음 처리
export const postReadMessage = async (request: ReadMessageRequest) => {
  const response = await apiClient.post(`chats/${request.roomId}`, {
    json: { lastReadAt: request.lastReadAt },
  });
  return response;
};
