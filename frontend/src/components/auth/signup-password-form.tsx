import {
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";

import type { SignupInfo } from "@/types/auth/type";
import Button from "@/components/common/button";
import Input from "@/components/common/input";
import usePasswordCheck from "@/hooks/auth/use-password-check";
import { cn } from "@/utils/style";

interface SignupPasswordFormProps {
  signupInfo: SignupInfo;
  setSignupInfo: Dispatch<SetStateAction<SignupInfo>>;
  onPrev: () => void;
  onNext: () => void;
}

const SignupPasswordForm = ({
  signupInfo,
  setSignupInfo,
  onPrev,
  onNext,
}: SignupPasswordFormProps) => {
  const { messageType, message } = usePasswordCheck(
    signupInfo.password,
    signupInfo.passwordCheck,
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSignupInfo((prev) => ({
      ...prev,
      password: value,
    }));
  };

  const handleChangePasswordCheck = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSignupInfo((prev) => ({
      ...prev,
      passwordCheck: value,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col justify-between gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl leading-9 font-bold">
          사용하실 비밀번호를
          <br />
          입력해주세요
        </h1>
        <Input
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          value={signupInfo.password}
          className={cn(
            messageType === "valid" ||
              signupInfo.password.length === 0 ||
              signupInfo.passwordCheck.length === 0
              ? "focus:ring-damul-main-300"
              : "focus:ring-red-400",
          )}
          autoFocus
          required
          maxLength={32}
          onChange={handleChangePassword}
        />

        <div className="flex flex-col gap-2">
          <Input
            type="password"
            placeholder="비밀번호를 한번 더 입력해 주세요"
            value={signupInfo.passwordCheck}
            className={cn(
              messageType === "valid" ||
                signupInfo.password.length === 0 ||
                signupInfo.passwordCheck.length === 0
                ? "focus:ring-damul-main-300"
                : "focus:ring-red-400",
            )}
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
          이전
        </Button>
        <Button className="w-full" disabled={messageType === "invalid"}>
          다음
        </Button>
      </div>
    </form>
  );
};

export default SignupPasswordForm;
