export type AuthForm = "login" | "signup" | "forgot";

export const enum SignupStep {
  EMAIL,
  PASSWORD,
  NICKNAME,
  COMPLETION,
  LENGTH,
}

export interface SignupInfo {
  email: string;
  password: string;
  passwordCheck: string;
  nickname: string;
}
