import { useContext, useEffect, useState } from "react";

import SideBarTab from "@/components/side-bar/side-bar-tab";
import SideBarContent from "@/components/side-bar/side-bar-content";
import { type SideBarTabType } from "@/types/side-bar/type";
import { WebSocketContext } from "@/contexts/chat/web-socket-provider";
import useCurrentUser from "@/hooks/auth/use-current-user";

const SideBar = () => {
  const [currentTab, setCurrentTab] = useState<SideBarTabType>("FRIEND");
  const { data } = useCurrentUser();
  const client = useContext(WebSocketContext);

  useEffect(() => {
    if (!data || !client) {
      return;
    }

    const subscription = client.subscribe(
      `/sub/notifications/${data.userId}`,
      (message) => {
        console.log("Message received:", message.body);
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [data, client]);

  return (
    <aside className="sticky top-0 flex h-dvh border-r border-neutral-200">
      <SideBarTab currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <SideBarContent currentTab={currentTab} />
    </aside>
  );
};

export default SideBar;
