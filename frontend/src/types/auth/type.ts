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

export interface ValueCheckRequest {
  value: string;
}

// Response ==========================================================================================================================
export interface LoginResponse {
  userId: number;
}
