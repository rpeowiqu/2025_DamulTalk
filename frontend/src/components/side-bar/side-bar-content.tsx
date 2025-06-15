import UserItem from "@/components/user/UserItem";
import SettingIcon from "@/components/icon/setting-icon";
import type { SideBarTabType } from "@/types/side-bar/type";

interface SideBarContentProps {
  currentTab: SideBarTabType;
}

const SideBarContent = ({ currentTab }: SideBarContentProps) => {
  const renderContent = () => {
    switch (currentTab) {
      case "FRIEND":
        return (
          <div className="text-center text-neutral-300">친구 목록 내용</div>
        );
      case "CHATTING":
        return (
          <div className="text-center text-neutral-300">채팅 목록 내용</div>
        );
    }
  };

  return (
    <div className="flex w-90 flex-col gap-6 bg-white p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-damul-main-300 text-4xl font-extrabold select-none">
          DamulTalk
        </h1>

        <button>
          <SettingIcon className="size-6 text-neutral-500" />
        </button>
      </div>

      <div className="flex items-center justify-between border-b border-neutral-300 py-3">
        <UserItem nickname="다믈랭 님" online={true} />
        <button className="shrink-0 cursor-pointer text-xs text-neutral-300">
          로그아웃
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default SideBarContent;
