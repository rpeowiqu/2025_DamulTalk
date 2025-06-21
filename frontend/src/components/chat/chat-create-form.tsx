import { useState, type Dispatch, type SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { ChatCreateStep, type ChatCreateInfo } from "@/types/chat/type";
import ChatCreateUserForm from "@/components/chat/chat-create-user-form";
import ChatCreateTitleForm from "@/components/chat/chat-create-title-form";

export interface ChatCreateFormProps {
  chatCreateInfo: ChatCreateInfo;
  setChatCreateInfo: Dispatch<SetStateAction<ChatCreateInfo>>;
  onPrev?: () => void;
  onNext?: () => void;
}

const ChatCreateForm = ({
  chatCreateInfo,
  setChatCreateInfo,
}: ChatCreateFormProps) => {
  const [step, setStep] = useState<ChatCreateStep>(ChatCreateStep.SELECT_USER);
  const navigate = useNavigate();

  const renderForm = () => {
    switch (step) {
      case ChatCreateStep.SELECT_USER:
        return (
          <ChatCreateUserForm
            chatCreateInfo={chatCreateInfo}
            setChatCreateInfo={setChatCreateInfo}
            onNext={() => setStep((prev) => prev + 1)}
          />
        );
      case ChatCreateStep.WRITE_TITLE:
        return (
          <ChatCreateTitleForm
            chatCreateInfo={chatCreateInfo}
            setChatCreateInfo={setChatCreateInfo}
            onPrev={() => setStep((prev) => prev - 1)}
            onNext={() => navigate(`/chat/${1}`)}
          />
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="h-132 bg-white">
        {renderForm()}
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatCreateForm;
