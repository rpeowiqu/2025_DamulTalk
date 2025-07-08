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
import useCheckCode from "@/hooks/auth/use-check-code";

interface PasswordResetCodeFormmProps {
  formData: PasswordResetInfo;
  setFormData: Dispatch<SetStateAction<PasswordResetInfo>>;
  onPrev: () => void;
  onNext: () => void;
}

const PasswordResetCodeForm = ({
  formData,
  setFormData,
  onPrev,
  onNext,
}: PasswordResetCodeFormmProps) => {
  const { messageType, message } = useCheckCode(formData.email, formData.code);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onNext();
  };

  const updateFormData = useMemo(
    () =>
      debounce((code: string) => {
        setFormData((prev) => ({
          ...prev,
          code,
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
        <h1 className="text-2xl leading-9 font-bold">
          이메일에 전송된 인증코드를
          <br />
          입력해주세요
        </h1>
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            placeholder="인증코드를 입력해 주세요"
            className={cn(
              messageType === "valid" || formData.code.length === 0
                ? "focus:ring-damul-main-300"
                : "focus:ring-red-400",
            )}
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            required
            maxLength={32}
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
          로그인 화면
        </Button>
        <Button className="w-full" disabled={messageType === "invalid"}>
          다음
        </Button>
      </div>
    </form>
  );
};

export default PasswordResetCodeForm;
