import apiClient from "@/utils/http-common";
import type {
  CheckEmailReqeust,
  LoginRequest,
  SignupRequest,
  CheckValueRequest,
  CheckCodeReqeust,
  NewPasswordReqeust,
  CheckEmailRequest,
} from "@/types/auth/type";
import type { User } from "@/types/community/type";

// 회원 가입
export const postSignup = async (request: SignupRequest) => {
  const response = await apiClient.post("auth/signup", {
    json: request,
  });
  return response;
};

// 로그인
export const postLogin = async (request: LoginRequest) => {
  const response = await apiClient.post("auth/login", {
    json: request,
  });
  return response;
};

// 로그아웃
export const postLogout = async () => {
  const response = await apiClient.post("auth/logout");
  return response;
};

// 이메일 중복체크
export const postCheckEmailDuplication = async (request: CheckValueRequest) => {
  const response = await apiClient.post("auth/duplicates/usernames", {
    json: request,
  });
  return response;
};

// 닉네임 중복체크
export const postCheckNicknameDuplication = async (
  request: CheckValueRequest,
) => {
  const response = await apiClient.post("auth/duplicates/nicknames", {
    json: request,
  });
  return response;
};

// 로그인 한 유저 정보 조회
export const getCurrentUser = async () => {
  const data = await apiClient.get("auth/info").json<User>();
  return data;
};

// 비밀번호 찾기 - 이메일로 인증코드 받기
export const postReceiveCode = async (request: CheckEmailRequest) => {
  const response = await apiClient.post("auth/password-reset/email", {
    json: request,
  });
  return response;
};

// 비밀번호 찾기 - 인증코드 검증
export const postCheckCode = async (request: CheckCodeReqeust) => {
  const response = await apiClient.post("auth/password-reset/code", {
    json: request,
  });
  return response;
};

// 비밀번호 찾기 - 새 비밀번호 설정
export const postNewPassword = async (request: NewPasswordReqeust) => {
  const response = await apiClient.post("auth/password-reset/new-password", {
    json: request,
  });
  return response;
};

// 리이슈
export const postUpdateToken = async () => {
  const response = await apiClient.post("auth/refresh");
  return response;
};
