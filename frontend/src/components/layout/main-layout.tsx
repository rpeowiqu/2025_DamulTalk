import { Outlet } from "react-router-dom";

import SideBar from "@/components/side-bar/side-bar";
import WebSocketProvider from "@/contexts/chat/web-socket-provider";

const MainLayout = () => {
  return (
    <WebSocketProvider>
      <div className="flex h-full flex-col xl:flex-row">
        <aside>
          <SideBar />
        </aside>

        <main className="min-h-0 flex-1">
          <Outlet />
        </main>
      </div>
    </WebSocketProvider>
  );
};

export default MainLayout;
