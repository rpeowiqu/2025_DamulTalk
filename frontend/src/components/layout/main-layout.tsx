import { Outlet } from "react-router-dom";

import SideBar from "@/components/side-bar/side-bar";

const MainLayout = () => {
  return (
    <div className="flex min-h-dvh bg-white">
      <SideBar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
