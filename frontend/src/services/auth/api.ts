import apiClient from "@/utils/http-common";
import type {
  LoginRequest,
  SignupRequest,
  ValueCheckRequest,
} from "@/types/auth/type";
import type { User } from "@/types/user/type";

export const postSignup = async (request: SignupRequest) => {
  const response = await apiClient.post("auth/signup", {
    json: request,
  });
  return response;
};

export const postLogin = async (request: LoginRequest) => {
  const response = await apiClient.post("auth/login", {
    json: request,
  });
  return response;
};

export const postLogout = async () => {
  const response = await apiClient.post("auth/logout");
  return response;
};

export const postEmailCheck = async (request: ValueCheckRequest) => {
  const response = await apiClient.post("auth/duplicates/usernames", {
    json: request,
  });
  return response;
};

export const postNicknameCheck = async (request: ValueCheckRequest) => {
  const response = await apiClient.post("auth/duplicates/nicknames", {
    json: request,
  });
  return response;
};

export const getCurrentUser = async () => {
  const data = await apiClient.get("auth/info").json<User>();
  return data;
};

export const postTokenUpdate = async () => {
  const response = await apiClient.post("auth/refresh");
  return response;
};
