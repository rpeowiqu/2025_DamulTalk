import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/components/layout/main-layout";
import ProfilePage from "@/pages/profile-page";
import SignupForm from "@/components/auth/signup-form";
import ChatPage from "@/pages/chat-page";
import BlankLayout from "@/components/layout/blank-layout";
import LoginPage from "@/pages/login-page";
import LoginForm from "@/components/auth/login-form";
import PasswordResetForm from "@/components/auth/password-reset-form";
import ProtectedRoute from "@/components/route/protected-route";
import NotFoundPage from "@/pages/not-found-page";
import SettingPage from "@/pages/setting-page";
import IntroPage from "@/pages/intro-page";

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/profiles/:userId",
            element: <ProfilePage />,
          },
          {
            path: "/chats/:roomId",
            element: <ChatPage />,
          },
          {
            path: "/setting",
            element: <SettingPage />,
          },
        ],
      },
    ],
  },
  {
    element: <BlankLayout />,
    children: [
      {
        path: "/",
        element: <IntroPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
        children: [
          {
            index: true,
            element: <LoginForm />,
          },
          {
            path: "signup",
            element: <SignupForm />,
          },
          {
            path: "password-reset",
            element: <PasswordResetForm />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
