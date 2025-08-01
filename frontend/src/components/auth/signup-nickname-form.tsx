import {
  useMemo,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { debounce } from "lodash-es";

import Button from "@/components/common/button";
import Input from "@/components/common/input";
import type { SignupInfo } from "@/types/auth/type";
import { cn } from "@/utils/style";
import useCheckNicknameDuplication from "@/hooks/auth/use-check-nickname-duplication";
import useSignup from "@/hooks/auth/use-signup";

interface SignupNicknameFormProps {
  formData: SignupInfo;
  setFormData: Dispatch<SetStateAction<SignupInfo>>;
  onPrev: () => void;
  onNext: () => void;
}

const SignupNicknameForm = ({
  formData,
  setFormData,
  onPrev,
  onNext,
}: SignupNicknameFormProps) => {
  const { messageType, message } = useCheckNicknameDuplication(
    formData.nickname,
  );
  const { mutate: signup } = useSignup({ onSuccess: onNext });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    signup({
      username: formData.email,
      password: formData.password,
      nickname: formData.nickname,
    });
  };

  const updateFormData = useMemo(
    () =>
      debounce(
        (nickname: string) =>
          setFormData((prev) => ({
            ...prev,
            nickname,
          })),
        400,
      ),
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
        <h1 className="text-2xl leading-9 font-bold dark:text-white">
          사용하실 닉네임을
          <br />
          입력해주세요
        </h1>
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            placeholder="닉네임을 입력해 주세요"
            defaultValue={formData.nickname}
            className={cn(
              messageType === "valid" || formData.nickname.length === 0
                ? "focus:ring-damul-main-300"
                : "focus:ring-red-400",
            )}
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            required
            maxLength={12}
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
          이전
        </Button>
        <Button className="w-full" disabled={messageType === "invalid"}>
          회원가입
        </Button>
      </div>
    </form>
  );
};

export default SignupNicknameForm;
