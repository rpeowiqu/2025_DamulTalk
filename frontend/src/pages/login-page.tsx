import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import backgroundImage from "@/assets/images/food-pattern.png";

const LoginPage = () => {
  const location = useLocation();

  return (
    <div className="h-dvh overflow-y-scroll px-4 py-12 md:px-6">
      <img
        src={backgroundImage}
        alt="배경 이미지"
        className="pointer-events-none fixed inset-0 z-0 size-full object-cover pr-[var(--scrollbar-width)] opacity-3 dark:opacity-3"
      />

      <div className="flex size-full min-h-fit items-center justify-center">
        <div className="border-damul-main-300 z-10 flex w-full max-w-120 flex-col gap-7 rounded-2xl border-2 bg-white px-6 py-10 dark:bg-neutral-800">
          <h1 className="text-damul-main-300 text-center text-4xl font-extrabold select-none">
            DamulTalk
          </h1>

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="h-100">
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
