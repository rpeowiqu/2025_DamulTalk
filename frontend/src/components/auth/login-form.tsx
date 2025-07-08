import { Link } from "react-router-dom";
import { useEffect, useRef, type FormEvent } from "react";

import Button from "@/components/common/button";
import Input from "@/components/common/input";
import CheckBox from "@/components/common/check-box";
import useLogin from "@/hooks/auth/use-login";

const LoginForm = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { message, mutate: login } = useLogin();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    if (email && password) {
      login({ username: email, password });

      // 이메일 저장 여부
      const saveEmail = formData.get("save-email") as string;
      if (saveEmail === "true") {
        localStorage.setItem("saved-email", email);
      } else {
        localStorage.removeItem("saved-email");
      }
    }
  };

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    const savedEmail = localStorage.getItem("saved-email");
    if (savedEmail) {
      inputRef.current.value = savedEmail;
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col justify-between bg-white">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-lg font-bold">
            이메일
          </label>
          <Input
            ref={inputRef}
            id="email"
            name="email"
            type="email"
            placeholder="이메일을 입력해 주세요"
            autoFocus
            autoCapitalize="off"
            required
            maxLength={64}
          />

          <CheckBox
            id="save-email"
            name="save-email"
            value="true"
            defaultChecked={!!localStorage.getItem("saved-email")}
            label="이메일 저장"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-lg font-bold">
            비밀번호
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            autoComplete="off"
            autoCapitalize="off"
            required
            maxLength={32}
          />

          <Link
            to="/"
            className="text-damul-main-300 w-fit font-bold select-none">
            비밀번호를 잊어 버리셨나요?
          </Link>
        </div>
      </div>

      {message && <p className="text-sm text-red-400">{message}</p>}

      <div className="flex flex-col gap-3">
        <Button>로그인</Button>

        <div>
          다믈톡이 처음이신가요?{" "}
          <Link
            to="signup"
            className="text-damul-main-300 font-bold select-none">
            회원가입
          </Link>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
