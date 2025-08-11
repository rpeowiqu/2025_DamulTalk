import SideBarTabButton from "@/components/side-bar/side-bar-tab-button";
import ChatIcon from "@/components/icon/chat-icon";
import UsersIcon from "@/components/icon/users-icon";
import useSideBarTabStore, {
  type SideBarTabType,
} from "@/store/side-bar-tab-store";

const tabs = [
  { type: "FRIEND", label: "친구", icon: UsersIcon },
  { type: "CHAT", label: "채팅", icon: ChatIcon },
] as const;

const SideBarTab = () => {
  const { currentTab, setCurrentTab, tabNotifications, setTabNotifications } =
    useSideBarTabStore();

  const handleClick = (type: SideBarTabType) => {
    setCurrentTab(type);
    setTabNotifications(type, false);
  };

  return (
    <div className="bg-damul-main-300 dark:bg-damul-main-500 flex flex-col gap-7 px-4 py-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;

        return (
          <SideBarTabButton
            key={tab.label}
            label={tab.label}
            selected={currentTab === tab.type}
            hasNewNotification={tabNotifications[tab.type]}
            onClick={() => handleClick(tab.type)}>
            <Icon className="size-7" />
          </SideBarTabButton>
        );
      })}
    </div>
  );
};

export default SideBarTab;
