import {
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";

import type { PasswordResetInfo } from "@/types/auth/type";
import Button from "@/components/common/button";
import Input from "@/components/common/input";
import useCheckPassword from "@/hooks/auth/use-check-password";
import { cn } from "@/utils/style";

interface PasswordResetNewPasswordFormProps {
  formData: PasswordResetInfo;
  setFormData: Dispatch<SetStateAction<PasswordResetInfo>>;
  onPrev: () => void;
  onNext: () => void;
}

const PasswordResetNewPasswordForm = ({
  formData,
  setFormData,
  onPrev,
  onNext,
}: PasswordResetNewPasswordFormProps) => {
  const { messageType, message } = useCheckPassword(
    formData.password,
    formData.passwordCheck,
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      password: e.target.value,
    }));
  };

  const handleChangePasswordCheck = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      passwordCheck: e.target.value,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col justify-between gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl leading-9 font-bold">
          새 비밀번호를
          <br />
          입력해주세요
        </h1>
        <Input
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          value={formData.password}
          className={cn(
            messageType === "valid" ||
              formData.password.length === 0 ||
              formData.passwordCheck.length === 0
              ? "focus:ring-damul-main-300"
              : "focus:ring-red-400",
          )}
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          required
          maxLength={32}
          onChange={handleChangePassword}
        />

        <div className="flex flex-col gap-2">
          <Input
            type="password"
            placeholder="비밀번호를 한번 더 입력해 주세요"
            value={formData.passwordCheck}
            className={cn(
              messageType === "valid" ||
                formData.password.length === 0 ||
                formData.passwordCheck.length === 0
                ? "focus:ring-damul-main-300"
                : "focus:ring-red-400",
            )}
            autoComplete="off"
            autoCapitalize="off"
            required
            maxLength={32}
            onChange={handleChangePasswordCheck}
          />

          <p
            className={cn(
              "text-sm",
              messageType === "valid" ? "text-damul-main-300" : "text-red-400",
            )}>
            {message}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button className="w-full" type="button" onClick={onPrev}>
          로그인 화면
        </Button>
        <Button className="w-full" disabled={messageType === "invalid"}>
          다음
        </Button>
      </div>
    </form>
  );
};

export default PasswordResetNewPasswordForm;
