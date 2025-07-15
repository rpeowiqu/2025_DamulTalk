import { createBrowserRouter, Navigate } from "react-router-dom";

import MainLayout from "@/components/layout/main-layout";
import ProfilePage from "@/pages/profile-page";
import SignupForm from "@/components/auth/signup-form";
import ChatPage from "@/pages/chat-page";
import BlankLayout from "@/components/layout/blank-layout";
import LoginPage from "@/pages/login-page";
import LoginForm from "@/components/auth/login-form";
import PasswordResetForm from "@/components/auth/password-reset-form";
import ProtectedRoute from "@/components/route/ProtectedRoute";

const router = createBrowserRouter([
  // 온보딩 페이지를 만들기 전까지 "/"에 접속하면 로그인 페이지로 리다이렉트 하도록 설정
  {
    path: "/",
    element: <Navigate to={"/login"} />,
  },

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
        ],
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
