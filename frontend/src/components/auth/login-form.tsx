import { Link } from "react-router-dom";

import Button from "@/components/common/button";
import Input from "@/components/common/input";

const LoginForm = () => {
  return (
    <form className="flex h-full flex-col justify-between bg-white">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-lg font-bold">
            이메일
          </label>
          <Input
            id="email"
            type="email"
            placeholder="이메일을 입력해 주세요"
            autoFocus
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-lg font-bold">
            비밀번호
          </label>
          <Input
            id="password"
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            required
          />

          <Link to="/" className="text-damul-main-300 w-fit font-bold">
            비밀번호를 잊어 버리셨나요?
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button>로그인</Button>

        <div>
          다믈톡이 처음이신가요?{" "}
          <Link to="signup" className="text-damul-main-300 font-bold">
            회원가입
          </Link>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
