import type {
  LoginRequest,
  SignupRequest,
  ValueCheckRequest,
} from "@/types/auth/type";
import apiClient from "@/utils/http-common";

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
