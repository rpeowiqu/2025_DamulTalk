import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import backgroundIamge from "@/assets/images/food-pattern.png";

const LoginPage = () => {
  const location = useLocation();

  return (
    <div className="relative flex h-dvh items-center justify-center">
      <img
        src={backgroundIamge}
        alt="배경 이미지"
        className="absolute inset-0 size-full object-cover opacity-10"
      />

      <div className="border-damul-main-300 z-10 flex w-full max-w-120 flex-col gap-7 rounded-2xl border-2 bg-white p-10">
        <h1 className="text-damul-main-300 text-center text-4xl font-extrabold select-none">
          DamulTalk
        </h1>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="h-96">
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoginPage;
