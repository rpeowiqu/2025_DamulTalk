import type {
  LoginRequest,
  SignupRequest,
  ValueCheckRequest,
} from "@/types/auth/type";
import apiClient from "@/utils/http-common";

export const postSignup = async (request: SignupRequest) => {
  const response = await apiClient.post("/auth/signup", {
    json: request,
  });
  return response;
};

export const postLogin = async (request: LoginRequest) => {
  const response = await apiClient.post("/auth/signin", {
    json: request,
  });
  return response;
};

export const postLogout = async () => {
  const response = await apiClient.post("/auth/signout");
  return response;
};

export const postEmailCheck = async (request: ValueCheckRequest) => {
  const response = await apiClient.post("/auth/duplicates/username", {
    json: request,
  });
  return response;
};

export const postNicknameCheck = async (request: ValueCheckRequest) => {
  const response = await apiClient.post("/auth/duplicates/nickname", {
    json: request,
  });
  return response;
};
