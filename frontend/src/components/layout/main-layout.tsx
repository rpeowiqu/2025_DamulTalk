import { Outlet } from "react-router-dom";

import SideBar from "@/components/side-bar/side-bar";
import WebSocketProvider from "@/contexts/chat/web-socket-provider";

const MainLayout = () => {
  return (
    <WebSocketProvider>
      <div className="flex bg-white dark:bg-neutral-800">
        <SideBar />
        <main className="h-dvh flex-1">
          <Outlet />
        </main>
      </div>
    </WebSocketProvider>
  );
};

export default MainLayout;
