import UserItem from "@/components/user/user-item";
import SettingButton from "@/components/user/setting-button";
import SideBarFriendContent from "@/components/side-bar/side-bar-friend-content";
import LogoutButton from "@/components/user/logout-button";
import type { SideBarTabType } from "@/types/side-bar/type";

interface SideBarContentProps {
  currentTab: SideBarTabType;
}

const SideBarContent = ({ currentTab }: SideBarContentProps) => {
  const renderContent = () => {
    switch (currentTab) {
      case "FRIEND":
        return <SideBarFriendContent />;
      case "CHATTING":
        return (
          <div className="text-center text-neutral-300">채팅 목록 내용</div>
        );
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
        <UserItem
          userId={1}
          nickname="다믈랭 님"
          online={true}
          className="hover:bg-white"
        />
        <LogoutButton />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default SideBarContent;
