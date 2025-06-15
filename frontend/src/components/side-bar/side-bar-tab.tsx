import type { Dispatch, SetStateAction } from "react";

import SideBarTabButton from "@/components/side-bar/side-bar-tab-button";
import ChatIcon from "@/components/icon/chat-icon";
import UsersIcon from "@/components/icon/users-icon";
import type { SideBarTabType } from "@/types/side-bar/type";

interface SideBarTabProps {
  currentTab: SideBarTabType;
  setCurrentTab: Dispatch<SetStateAction<SideBarTabType>>;
}

const tabs = [
  { type: "FRIEND", label: "친구", icon: UsersIcon },
  { type: "CHATTING", label: "채팅", icon: ChatIcon },
] as const;

const SideBarTab = ({ currentTab, setCurrentTab }: SideBarTabProps) => {
  return (
    <div className="bg-damul-main-300 flex flex-col gap-7 px-4 py-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;

        return (
          <SideBarTabButton
            key={tab.label}
            label={tab.label}
            selected={currentTab === tab.type}
            onClick={() => setCurrentTab(tab.type)}>
            <Icon className="size-8" />
          </SideBarTabButton>
        );
      })}
    </div>
  );
};

export default SideBarTab;
