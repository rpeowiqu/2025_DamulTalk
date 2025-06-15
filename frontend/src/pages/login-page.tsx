import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const LoginPage = () => {
  const location = useLocation();

  return (
    <div className="flex h-dvh items-center justify-center">
      <div className="border-damul-main-300 flex w-full max-w-120 flex-col gap-7 rounded-2xl border-2 bg-white p-10">
        <h1 className="text-damul-main-300 text-center text-4xl font-extrabold">
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
