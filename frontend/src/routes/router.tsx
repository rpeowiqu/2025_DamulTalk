import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/components/layout/main-layout";
import ProfilePage from "@/pages/profile-page";
import SignupForm from "@/components/auth/signup-form";
import ChatPage from "@/pages/chat-page";
import BlankLayout from "@/components/layout/blank-layout";
import LoginPage from "@/pages/login-page";
import LoginForm from "@/components/auth/login-form";
import PasswordResetForm from "@/components/auth/password-reset-form";

const router = createBrowserRouter([
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
    ],
  },
  {
    element: <BlankLayout />,
    children: [
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
    ],
  },
]);

export default router;
