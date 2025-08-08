import Button from "@/components/common/button";
import CircularCheckMark from "@/animations/CircularCheckMark";

interface PasswordResetCompletionFormProps {
  onNext: () => void;
}

const PasswordResetCompletionForm = ({
  onNext,
}: PasswordResetCompletionFormProps) => {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        <CircularCheckMark
          className="stroke-damul-main-300 size-16 stroke-20"
          duration={0.8}
          delay={0.2}
        />

        <div className="text-center">
          <h1 className="text-2xl leading-9 font-bold dark:text-white">
            비밀번호가 재설정 되었어요!
          </h1>
        </div>
      </div>

      <Button className="w-full" type="button" onClick={onNext}>
        로그인 화면
      </Button>
    </div>
  );
};

export default PasswordResetCompletionForm;
