import {
  useMemo,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { debounce } from "lodash-es";

import Input from "@/components/common/input";
import Button from "@/components/common/button";
import type { PasswordResetInfo } from "@/types/auth/type";
import { cn } from "@/utils/style";
import useCheckEmail from "@/hooks/auth/use-check-email";

interface PasswordResetEmailFormProps {
  formData: PasswordResetInfo;
  setFormData: Dispatch<SetStateAction<PasswordResetInfo>>;
  onPrev: () => void;
  onNext: () => void;
}

const PasswordResetEmailForm = ({
  formData,
  setFormData,
  onPrev,
  onNext,
}: PasswordResetEmailFormProps) => {
  const {
    messageType,
    message,
    mutate: receiveCode,
  } = useCheckEmail(formData.email);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    receiveCode(formData.email);
  };

  const updateFormData = useMemo(
    () =>
      debounce((email: string) => {
        setFormData((prev) => ({
          ...prev,
          email,
        }));
      }, 400),
    [],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateFormData(e.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col justify-between gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl leading-9 font-bold md:text-2xl dark:text-white">
          가입하신 이메일을
          <br />
          입력해주세요
        </h1>
        <div className="flex flex-col gap-2">
          <Input
            type="email"
            placeholder="이메일을 입력해 주세요"
            className={cn(
              messageType === "valid" || formData.email.length === 0
                ? "focus:ring-damul-main-300"
                : "focus:ring-red-400",
            )}
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            required
            maxLength={64}
            onChange={handleChange}
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
          로그인
        </Button>
        <Button
          className="w-full"
          disabled={messageType === "invalid"}
          onClick={onNext}>
          다음
        </Button>
      </div>
    </form>
  );
};

export default PasswordResetEmailForm;
