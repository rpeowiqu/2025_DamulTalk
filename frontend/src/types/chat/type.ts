import type { UserInfo } from "@/types/user/type";

export enum ChatCreateStep {
  SELECT_USER,
  WRITE_TITLE,
  LENGTH,
}

export interface ChatCreateInfo {
  title: string;
  selectedUsers: UserInfo[];
}
