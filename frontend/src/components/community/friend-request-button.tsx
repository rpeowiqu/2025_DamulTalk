import { type ButtonHTMLAttributes } from "react";
import { useParams } from "react-router-dom";
import {
  CheckIcon,
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
            className="flex items-center justify-center gap-2 self-center bg-red-400 py-2 hover:bg-red-500"
            {...props}
            onClick={deleteFriend}>
            <UserRoundMinus />
            <p>친구 삭제</p>
          </Button>
        );
      case "PENDING_REQUEST":
        return (
          <Button
            className="flex items-center justify-center gap-2 bg-neutral-300 py-2 hover:bg-neutral-400"
            {...props}
            onClick={deleteFriend}>
            <UserRoundCogIcon />
            <p>친구 추가 요청함</p>
          </Button>
        );
      case "PENDING_RESPONSE":
        return (
          <div className="flex items-center gap-4">
            <p className="text-neutral-500">
              이 유저는 회원님께 친구 추가 요청을 했어요
            </p>

            <Button
              className="bg-damul-main-300 hover:bg-damul-main-400 flex items-center justify-center gap-2 py-2"
              {...props}
              onClick={acceptFriend}>
              <CheckIcon />
              <p>수락</p>
            </Button>

            <Button
              className="flex items-center justify-center gap-2 bg-red-400 py-2 hover:bg-red-500"
              {...props}
              onClick={rejectFriend}>
              <XIcon />
              <p>거절</p>
            </Button>
          </div>
        );
      case "NONE":
        return (
          <Button
            className="bg-damul-main-300 hover:bg-damul-main-400 flex items-center justify-center gap-2 py-2"
            {...props}
            onClick={requestFriend}>
            <UserRoundPlusIcon />
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
