import {
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

import { ChatCreateStep, type ChatCreateInfo } from "@/types/chat/type";
import ChatCreateUserForm from "@/components/chat/chat-create-user-form";
import ChatCreateTitleForm from "@/components/chat/chat-create-title-form";
import useCreateChatRoom from "@/hooks/chat/use-create-chat-room";

export interface ChatCreateFormProps {
  chatCreateInfo: ChatCreateInfo;
  setChatCreateInfo: Dispatch<SetStateAction<ChatCreateInfo>>;
  isDefaultName: RefObject<boolean>;
  onPrev?: () => void;
  onNext?: () => void;
}

const ChatCreateForm = ({
  chatCreateInfo,
  setChatCreateInfo,
  isDefaultName,
}: ChatCreateFormProps) => {
  const [step, setStep] = useState<ChatCreateStep>(ChatCreateStep.SELECT_USER);
  const { mutate: createChatRoom } = useCreateChatRoom();

  const renderForm = () => {
    switch (step) {
      case ChatCreateStep.SELECT_USER:
        return (
          <ChatCreateUserForm
            chatCreateInfo={chatCreateInfo}
            setChatCreateInfo={setChatCreateInfo}
            isDefaultName={isDefaultName}
            onNext={() => setStep((prev) => prev + 1)}
          />
        );
      case ChatCreateStep.WRITE_TITLE:
        return (
          <ChatCreateTitleForm
            chatCreateInfo={chatCreateInfo}
            setChatCreateInfo={setChatCreateInfo}
            isDefaultName={isDefaultName}
            onPrev={() => setStep((prev) => prev - 1)}
            onNext={() =>
              createChatRoom({
                roomName: chatCreateInfo.roomName,
                userIds: chatCreateInfo.selectedUsers.map(
                  (item) => item.userId,
                ),
                isNameChanged: isDefaultName.current,
              })
            }
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
        className="h-132">
        {renderForm()}
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatCreateForm;
