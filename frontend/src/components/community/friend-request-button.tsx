import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes } from "react";
import { useParams } from "react-router-dom";
import {
  UserRoundCogIcon,
  UserRoundMinus,
  UserRoundPlusIcon,
} from "lucide-react";

import { cn } from "@/utils/style";
import useToggleFriendRequest from "@/hooks/community/use-toggle-friend-request";
import type { FriendRequestType } from "@/types/community/type";

const buttonVariants = cva(
  "flex gap-3 items-center justify-center cursor-pointer rounded-lg px-5 py-2 text-lg font-bold text-white transition-color duration-300 disabled:bg-neutral-200",
  {
    variants: {
      variant: {
        ACCEPTED: "bg-red-400 hover:bg-red-500",
        PENDING: "bg-neutral-300 hover:bg-neutral-400",
        ME: "",
        NONE: "bg-damul-main-300 hover:bg-damul-main-400",
      },
    },
    defaultVariants: {
      variant: "ACCEPTED",
    },
  },
);

interface FriendRequestButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  variant: FriendRequestType;
}

const FriendRequestButton = ({
  variant,
  className,
  ...props
}: FriendRequestButtonProps) => {
  const { userId } = useParams();
  const { optimisticState, toggleFriendRequest } = useToggleFriendRequest(
    Number(userId),
    variant,
  );

  const renderContent = () => {
    switch (optimisticState) {
      case "ACCEPTED":
        return (
          <>
            <UserRoundMinus />
            <p>친구 삭제</p>
          </>
        );
      case "PENDING":
        return (
          <>
            <UserRoundCogIcon />
            <p>친구 추가 요청함</p>
          </>
        );
      case "ME":
        return null;
      case "NONE":
        return (
          <>
            <UserRoundPlusIcon />
            <p>친구 추가</p>
          </>
        );
    }
  };

  return (
    <button
      className={cn(buttonVariants({ variant: optimisticState }), className)}
      {...props}
      onClick={toggleFriendRequest}>
      {renderContent()}
    </button>
  );
};

export default FriendRequestButton;
