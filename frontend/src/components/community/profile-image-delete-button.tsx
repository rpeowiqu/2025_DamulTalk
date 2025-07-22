import { Trash2Icon } from "lucide-react";

interface ProfileImageDeleteButtonProps {
  onClick: () => void;
}

const ProfileImageDeleteButton = ({
  onClick,
}: ProfileImageDeleteButtonProps) => {
  return (
    <button
      className="hover:bg-damul-main-300/20 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg p-2 font-bold"
      onClick={onClick}>
      <Trash2Icon className="size-5">삭제</Trash2Icon>
      <p className="text-sm">삭제</p>
    </button>
  );
};

export default ProfileImageDeleteButton;
