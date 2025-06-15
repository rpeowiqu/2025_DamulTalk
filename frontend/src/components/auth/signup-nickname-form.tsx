import {
  useCallback,
  useState,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { debounce } from "lodash-es";

import Button from "@/components/common/button";
import type { SignupInfo } from "@/types/auth/type";
import { cn } from "@/utils/style";
import useNicknameCheck from "@/hooks/auth/useNicknameCheck";

interface SignupNicknameFormProps {
  signupInfo: SignupInfo;
  setSignupInfo: Dispatch<SetStateAction<SignupInfo>>;
  onPrev: () => void;
  onNext: () => void;
}

const SignupNicknameForm = ({
  signupInfo,
  setSignupInfo,
  onPrev,
  onNext,
}: SignupNicknameFormProps) => {
  const [nickname, setNickname] = useState("");
  const { messageType, message } = useNicknameCheck(signupInfo.nickname);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const updateSignupNickname = useCallback(
    debounce(
      (nickname: string) =>
        setSignupInfo((prev) => ({
          ...prev,
          nickname,
        })),
      400,
    ),
    [],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNickname(value);
    updateSignupNickname(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col justify-between gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl leading-9 font-bold">
          사용하실 닉네임을
          <br />
          입력해주세요
        </h1>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="닉네임을 입력해 주세요"
            value={nickname}
            className={cn(
              "w-full rounded-xl border border-neutral-200 px-4 py-3 placeholder:text-neutral-300 focus:ring-2 focus:outline-none",
              messageType === "valid" || signupInfo.nickname.length === 0
                ? "focus:ring-damul-main-300"
                : "focus:ring-red-400",
            )}
            autoFocus
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
