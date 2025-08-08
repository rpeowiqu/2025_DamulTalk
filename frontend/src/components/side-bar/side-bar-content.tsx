import { useNavigate } from "react-router-dom";

import UserItem from "@/components/community/user-item";
import SettingButton from "@/components/community/setting-button";
import SideBarFriendContent from "@/components/side-bar/side-bar-friend-content";
import SideBarChatContent from "@/components/side-bar/side-bar-chat-content";
import LogoutButton from "@/components/auth/logout-button";
import useCurrentUser from "@/hooks/auth/use-current-user";
import UserItemSkeleton from "@/components/community/user-item-skeleton";
import useSideBarTabStore from "@/store/side-bar-tab-store";
import ThemeChangeButton from "@/components/theme/theme-change-button";

const SideBarContent = () => {
  const currentTab = useSideBarTabStore((state) => state.currentTab);
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
    <div className="flex w-90 flex-col gap-4 bg-white p-6 dark:bg-neutral-800">
      <div className="flex items-center justify-between">
        <h1 className="text-damul-main-300 text-4xl font-extrabold select-none">
          DamulTalk
        </h1>
        <div className="flex gap-4">
          <ThemeChangeButton className="text-neutral-500 dark:text-neutral-100" />
          <SettingButton />
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-neutral-300 pb-1 dark:border-neutral-500">
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
