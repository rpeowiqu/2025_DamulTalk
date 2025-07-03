import { useNavigate } from "react-router-dom";

import UserItem from "@/components/community/user-item";
import SettingButton from "@/components/community/setting-button";
import SideBarFriendContent from "@/components/side-bar/side-bar-friend-content";
import SideBarChatContent from "@/components/side-bar/side-bar-chat-content";
import LogoutButton from "@/components/auth/logout-button";
import type { SideBarTabType } from "@/types/side-bar/type";
import useCurrentUser from "@/hooks/auth/use-current-user";
import UserItemSkeleton from "@/components/community/user-item-skeleton";

interface SideBarContentProps {
  currentTab: SideBarTabType;
}

const SideBarContent = ({ currentTab }: SideBarContentProps) => {
  const { data, isLoading } = useCurrentUser();
  const navigate = useNavigate();

  const renderContent = () => {
    switch (currentTab) {
      case "FRIEND":
        return <SideBarFriendContent user={data} />;
      case "CHAT":
        return <SideBarChatContent />;
    }
  };

  return (
    <div className="flex w-90 flex-col gap-4 bg-white p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-damul-main-300 text-4xl font-extrabold select-none">
          DamulTalk
        </h1>
        <SettingButton />
      </div>

      <div className="flex items-center justify-between border-b border-neutral-300 pb-1">
        {isLoading ? (
          <UserItemSkeleton visibleStatus={true} />
        ) : data ? (
          <UserItem
            user={{ ...data, online: true }}
            className="hover:bg-white"
            onClick={() => navigate(`/profiles/${data.userId}`)}>
            <LogoutButton />
          </UserItem>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default SideBarContent;
