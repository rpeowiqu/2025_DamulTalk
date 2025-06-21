import { Outlet } from "react-router-dom";

const BlankLayout = () => {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default BlankLayout;
