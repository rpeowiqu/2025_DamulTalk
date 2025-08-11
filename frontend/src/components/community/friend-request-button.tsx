import { type ButtonHTMLAttributes } from "react";
import { useParams } from "react-router-dom";
import {
  CheckIcon,
  InfoIcon,
  UserRoundCogIcon,
  UserRoundMinus,
  UserRoundPlusIcon,
  XIcon,
} from "lucide-react";

import useHandleFriendRequest from "@/hooks/community/use-handle-friend-request";
import type { FriendRequestType } from "@/types/community/type";
import Button from "@/components/common/button";

interface FriendRequestButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  isFriend: FriendRequestType;
}

const FriendRequestButton = ({
  isFriend,
  ...props
}: FriendRequestButtonProps) => {
  const { userId } = useParams();
  const {
    optimisticState,
    requestFriend,
    deleteFriend,
    acceptFriend,
    rejectFriend,
  } = useHandleFriendRequest(Number(userId), isFriend);

  const renderContent = () => {
    switch (optimisticState) {
      case "ACCEPTED":
        return (
          <Button
            variant="dangerous"
            className="flex items-center justify-center gap-2 py-2"
            {...props}
            onClick={deleteFriend}>
            <UserRoundMinus className="size-5 md:size-6" />
            <p>친구 삭제</p>
          </Button>
        );
      case "PENDING_REQUEST":
        return (
          <Button
            className="flex items-center justify-center gap-2 self-end bg-neutral-400 py-2 hover:bg-neutral-500 dark:bg-neutral-400 dark:hover:bg-neutral-500"
            {...props}
            onClick={deleteFriend}>
            <UserRoundCogIcon className="size-5 md:size-6" />
            <p>친구 추가 요청함</p>
          </Button>
        );
      case "PENDING_RESPONSE":
        return (
          <div className="flex flex-col justify-center gap-4 self-center">
            <div className="flex items-center gap-2 text-neutral-500 md:text-base dark:text-neutral-300">
              <InfoIcon className="size-3 md:size-4" />
              <p className="text-sm md:text-base">
                이 유저는 회원님께 친구 추가 요청을 했어요
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                className="bg-damul-main-300 hover:bg-damul-main-400 flex items-center justify-center gap-2 py-2"
                {...props}
                onClick={acceptFriend}>
                <CheckIcon className="size-5 md:size-6" />
                <p>수락</p>
              </Button>

              <Button
                variant="dangerous"
                className="flex items-center justify-center gap-2 py-2"
                {...props}
                onClick={rejectFriend}>
                <XIcon className="size-5 md:size-6" />
                <p>거절</p>
              </Button>
            </div>
          </div>
        );
      case "NONE":
        return (
          <Button
            className="bg-damul-main-300 hover:bg-damul-main-400 flex items-center justify-center gap-2 py-2"
            {...props}
            onClick={requestFriend}>
            <UserRoundPlusIcon className="size-5 md:size-6" />
            <p>친구 추가</p>
          </Button>
        );
      default:
        return null;
    }
  };

  return renderContent();
};

export default FriendRequestButton;
