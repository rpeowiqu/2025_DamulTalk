import { createBrowserRouter } from "react-router-dom";

import BlankLayout from "@/components/layout/blank-layout";
import LoginPage from "@/pages/login-page";
import LoginForm from "@/components/auth/login-form";
import SignupForm from "@/components/auth/signup-form";

const router = createBrowserRouter([
  {
    path: "/",
    element: <BlankLayout />,
    children: [
      {
        path: "login",
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
        ],
      },
    ],
  },
]);

export default router;
