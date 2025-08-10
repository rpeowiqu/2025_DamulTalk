import Button from "@/components/common/button";
import type { SignupInfo } from "@/types/auth/type";
import CircularCheckMark from "@/animations/CircularCheckMark";

interface SignupCompletionFormProps {
  signupInfo: SignupInfo;
  onNext: () => void;
}

const SignupCompletionForm = ({
  signupInfo,
  onNext,
}: SignupCompletionFormProps) => {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        <CircularCheckMark
          className="stroke-damul-main-300 size-16 stroke-20"
          duration={0.8}
          delay={0.2}
        />

        <div className="text-center dark:text-white">
          <h1 className="text-xl leading-9 font-bold md:text-2xl">
            회원가입이 완료되었어요!
          </h1>
          <p className="md:text-lg">
            <span className="font-bold">{signupInfo.nickname}</span> 님 반가워요
          </p>
        </div>
      </div>

      <Button className="w-full" type="button" onClick={onNext}>
        로그인
      </Button>
    </div>
  );
};

export default SignupCompletionForm;
