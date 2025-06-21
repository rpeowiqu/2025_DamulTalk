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
import Input from "@/components/common/input";
import type { SignupInfo } from "@/types/auth/type";
import useEmailCheck from "@/hooks/auth/useEmailCheck";
import { cn } from "@/utils/style";

interface SignupEmailFormProps {
  signupInfo: SignupInfo;
  setSignupInfo: Dispatch<SetStateAction<SignupInfo>>;
  onPrev: () => void;
  onNext: () => void;
}

const SignupEmailForm = ({
  signupInfo,
  setSignupInfo,
  onPrev,
  onNext,
}: SignupEmailFormProps) => {
  const [email, setEmail] = useState(signupInfo.email);
  const { messageType, message } = useEmailCheck(signupInfo.email);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const updateSignupEmail = useCallback(
    debounce(
      (email: string) =>
        setSignupInfo((prev) => ({
          ...prev,
          email,
        })),
      400,
    ),
    [],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
    updateSignupEmail(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col justify-between gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl leading-9 font-bold">
          사용하실 이메일을
          <br />
          입력해주세요
        </h1>
        <div className="flex flex-col gap-2">
          <Input
            type="email"
            placeholder="이메일을 입력해 주세요"
            value={email}
            className={cn(
              messageType === "valid" || signupInfo.email.length === 0
                ? "focus:ring-damul-main-300"
                : "focus:ring-red-400",
            )}
            autoFocus
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
          로그인 화면
        </Button>
        <Button className="w-full" disabled={messageType === "invalid"}>
          다음
        </Button>
      </div>
    </form>
  );
};

export default SignupEmailForm;
