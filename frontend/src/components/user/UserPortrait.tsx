import DefaultPortraitImage from "@/assets/images/boy-portrait.png";
import { cn } from "@/utils/style";

interface UserPortraitProps {
  profileImage?: string;
  online?: boolean;
  className?: string;
}

const UserPortrait = ({
  profileImage,
  online,
  className,
}: UserPortraitProps) => {
  return (
    <div className={cn("relative size-12", className)}>
      <div className="overflow-hidden rounded-full border border-neutral-200">
        <img
          src={profileImage || DefaultPortraitImage}
          alt="프로필 이미지"
          className="size-full object-cover"
        />
      </div>

      {online !== undefined && (
        <div
          className={cn(
            "absolute right-0 bottom-0 size-3 rounded-full",
            online ? "bg-green-400" : "bg-neutral-200",
          )}
        />
      )}
    </div>
  );
};

export default UserPortrait;
