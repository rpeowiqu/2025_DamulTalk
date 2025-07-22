import defaultPortraitImage from "@/assets/images/boy-portrait.png";
import { cn } from "@/utils/style";

interface UserPortraitProps {
  profileImageUrl?: string | null;
  online?: boolean;
  className?: string;
}

const UserPortrait = ({
  profileImageUrl,
  online,
  className,
}: UserPortraitProps) => {
  return (
    <div className={cn("relative size-12 rounded-full", className)}>
      <div className="size-full overflow-hidden rounded-full border border-neutral-200">
        <img
          src={profileImageUrl || defaultPortraitImage}
          alt="프로필 이미지"
          className="size-full bg-white object-cover"
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
