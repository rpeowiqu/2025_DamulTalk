import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { type PasswordResetInfo, PasswordResetStep } from "@/types/auth/type";
import StepProgress from "@/components/common/step-progress";
import PasswordResetEmailForm from "@/components/auth/password-reset-email-form";
import PasswordResetCodeForm from "@/components/auth/password-reset-code-form";
import PasswordResetNewPasswordForm from "@/components/auth/password-reset-new-password-form";
import PasswordResetCompletionForm from "@/components/auth/password-reset-completion-form";

const PasswordResetForm = () => {
  const [formData, setFormData] = useState<PasswordResetInfo>({
    email: "",
    code: "",
    password: "",
    passwordCheck: "",
  });
  const [step, setStep] = useState<PasswordResetStep>(PasswordResetStep.EMAIL);
  const navigate = useNavigate();

  const renderForm = () => {
    switch (step) {
      case PasswordResetStep.EMAIL:
        return (
          <PasswordResetEmailForm
            formData={formData}
            setFormData={setFormData}
            onPrev={() => navigate("/login")}
            onNext={() => setStep((prev) => prev + 1)}
          />
        );
      case PasswordResetStep.CODE:
        return (
          <PasswordResetCodeForm
            formData={formData}
            setFormData={setFormData}
            onPrev={() => navigate("/login")}
            onNext={() => setStep((prev) => prev + 1)}
          />
        );
      case PasswordResetStep.NEW_PASSWORD:
        return (
          <PasswordResetNewPasswordForm
            formData={formData}
            setFormData={setFormData}
            onPrev={() => navigate("/login")}
            onNext={() => setStep((prev) => prev + 1)}
          />
        );
      case PasswordResetStep.COMPLETION:
        return (
          <PasswordResetCompletionForm onNext={() => navigate("/login")} />
        );
    }
  };

  return (
    <div className="flex h-full flex-col gap-10">
      <StepProgress
        value={Math.floor(100 / (PasswordResetStep.LENGTH - 1)) * step}
        stepCount={PasswordResetStep.LENGTH}
        className="h-1 bg-neutral-200 dark:bg-neutral-50"
        indicatorClassName="bg-damul-main-300"
        stepClassName="size-7"
        stepLabels={["이메일", "인증코드", "새 비밀번호", "변경 완료"]}
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

export default PasswordResetForm;
