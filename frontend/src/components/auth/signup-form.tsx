import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import StepProgress from "@/components/common/step-progress";
import { type SignupInfo, SignupStep } from "@/types/auth/type";
import SignupEmailForm from "@/components/auth/signup-email-form";
import SignupPasswordForm from "@/components/auth/signup-password-form";
import SignupNicknameForm from "@/components/auth/signup-nickname-form";
import SignupCompletionForm from "@/components/auth/signup-completion-form";
import useSignup from "@/hooks/auth/use-signup";

const SignupForm = () => {
  const [signupInfo, setSignupInfo] = useState<SignupInfo>({
    email: "",
    password: "",
    passwordCheck: "",
    nickname: "",
  });
  const [step, setStep] = useState<SignupStep>(SignupStep.EMAIL);
  const navigate = useNavigate();
  const { mutate: signup } = useSignup({
    onSuccess: () => setStep((prev) => prev + 1),
  });

  const renderForm = () => {
    switch (step) {
      case SignupStep.EMAIL:
        return (
          <SignupEmailForm
            signupInfo={signupInfo}
            setSignupInfo={setSignupInfo}
            onPrev={() => navigate("/login")}
            onNext={() => setStep((prev) => prev + 1)}
          />
        );
      case SignupStep.PASSWORD:
        return (
          <SignupPasswordForm
            signupInfo={signupInfo}
            setSignupInfo={setSignupInfo}
            onPrev={() => setStep((prev) => prev - 1)}
            onNext={() => setStep((prev) => prev + 1)}
          />
        );
      case SignupStep.NICKNAME:
        return (
          <SignupNicknameForm
            signupInfo={signupInfo}
            setSignupInfo={setSignupInfo}
            onPrev={() => setStep((prev) => prev - 1)}
            onNext={() =>
              signup({
                username: signupInfo.email,
                password: signupInfo.password,
                nickname: signupInfo.nickname,
              })
            }
          />
        );
      case SignupStep.COMPLETION:
        return <SignupCompletionForm signupInfo={signupInfo} />;
    }
  };

  return (
    <div className="flex h-full flex-col gap-10 bg-white">
      <StepProgress
        value={(100 / (SignupStep.LENGTH - 1)) * step}
        stepCount={SignupStep.LENGTH}
        className="h-1 bg-neutral-200"
        indicatorClassName="bg-damul-main-300"
        stepClassName="size-7"
        stepLabels={["이메일", "비밀번호", "닉네임", "가입 완료"]}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1">
          {renderForm()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SignupForm;
