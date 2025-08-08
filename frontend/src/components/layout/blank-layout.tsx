import { Outlet } from "react-router-dom";

const BlankLayout = () => {
  return (
    <div className="flex min-h-dvh flex-col bg-white dark:bg-neutral-800">
      <main className="min-h-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default BlankLayout;
