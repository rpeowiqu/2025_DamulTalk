import { useState } from "react";

import SideBarTab from "@/components/side-bar/side-bar-tab";
import SideBarContent from "@/components/side-bar/side-bar-content";
import { type SideBarTabType } from "@/types/side-bar/type";

const SideBar = () => {
  const [currentTab, setCurrentTab] = useState<SideBarTabType>("FRIEND");

  return (
    <aside className="flex border-r border-neutral-200">
      <SideBarTab currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <SideBarContent currentTab={currentTab} />
    </aside>
  );
};

export default SideBar;
