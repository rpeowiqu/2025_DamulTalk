import type { ChangeEvent, FormEvent } from "react";

import type { ChatCreateFormProps } from "@/components/chat/chat-create-form";
import Input from "@/components/common/input";
import Button from "@/components/common/button";

const ChatCreateTitleForm = ({
  chatCreateInfo,
  setChatCreateInfo,
  onPrev,
  onNext,
}: ChatCreateFormProps) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onNext?.();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChatCreateInfo((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col justify-between">
      <div className="mt-4 flex flex-col gap-4">
        <h1 className="text-2xl leading-9 font-bold">
          채팅방 이름을
          <br />
          입력해 주세요
        </h1>
        <Input
          placeholder="채팅방 이름을 입력해 주세요"
          value={chatCreateInfo.title}
          onChange={handleChange}
          maxLength={64}
        />
      </div>

      <div className="flex gap-3">
        <Button type="button" className="w-full" onClick={onPrev}>
          이전
        </Button>
        <Button className="w-full" disabled={chatCreateInfo.title.length === 0}>
          만들기
        </Button>
      </div>
    </form>
  );
};

export default ChatCreateTitleForm;
