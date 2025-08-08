export type AuthForm = "login" | "signup" | "forgot";

export interface LoginInfo {
  email: string;
  password: string;
}

export interface SignupInfo {
  email: string;
  password: string;
  passwordCheck: string;
  nickname: string;
}

export const enum SignupStep {
  EMAIL,
  PASSWORD,
  NICKNAME,
  COMPLETION,
  LENGTH,
}

export interface PasswordResetInfo {
  email: string;
  code: string;
  password: string;
  passwordCheck: string;
}

export const enum PasswordResetStep {
  EMAIL,
  CODE,
  NEW_PASSWORD,
  COMPLETION,
  LENGTH,
}

// Request ==========================================================================================================================
export interface SignupRequest {
  username: string;
  password: string;
  nickname: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface CheckValueRequest {
  value: string;
}

export interface CheckEmailRequest {
  email: string;
}

export interface CheckCodeReqeust {
  email: string;
  code: string;
}

export interface NewPasswordReqeust {
  password: string;
}

// Response ==========================================================================================================================
export interface LoginResponse {
  userId: number;
}
