import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/components/layout/main-layout";
import ProfilePage from "@/pages/profile-page";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/profile/:userId",
        element: <ProfilePage />,
      },
    ],
  },
]);

export default router;
