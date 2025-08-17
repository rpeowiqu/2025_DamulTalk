import { Trash2Icon } from "lucide-react";

interface ProfileImageDeleteButtonProps {
  onClick: () => void;
}

const ProfileImageDeleteButton = ({
  onClick,
}: ProfileImageDeleteButtonProps) => {
  return (
    <button
      className="hover:bg-damul-main-300/20 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg p-1 font-bold md:p-2"
      onClick={onClick}>
      <Trash2Icon className="size-4 md:size-5">삭제</Trash2Icon>
      <p className="hidden text-sm md:block">삭제</p>
    </button>
  );
};

export default ProfileImageDeleteButton;
