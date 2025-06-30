import { useNavigate } from "react-router-dom";

import type { User } from "@/types/user/type";
import Dialog, { type DialogProps } from "@/components/common/dialog";
import SearchBar from "@/components/common/search-bar";
import FriendList from "@/components/user/friend-list";

interface ChatRoomMemberModalProps extends DialogProps {
  members: User[];
}

const ChatRoomMemberModal = ({
  members,
  open,
  onOpenChange,
  ...props
}: ChatRoomMemberModalProps) => {
  const navigate = useNavigate();

  const handleUserSelect = (user: User) => {
    navigate(`/profile/${user.userId}`);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="채팅방 멤버"
      titleClassName="text-damul-main-300 border-b border-damul-main-500 pb-4"
      {...props}>
      <div className="flex flex-col gap-4">
        <SearchBar onSearch={(keyword) => console.log(keyword)} />
        <FriendList
          users={members}
          visibleStatus={false}
          className="scroll-hidden min-h-0 flex-1 overflow-y-auto"
          onSelect={(user) => handleUserSelect(user)}
        />
      </div>
    </Dialog>
  );
};

export default ChatRoomMemberModal;
