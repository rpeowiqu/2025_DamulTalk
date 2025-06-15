import { motion } from "framer-motion";

import { cn } from "@/utils/style";

interface CircularCheckMarkProps {
  className?: string;
  duration?: number;
  delay?: number;
}

const CircularCheckMark = ({
  className,
  duration = 1,
  delay = 0,
}: CircularCheckMarkProps) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="258"
      height="258"
      viewBox="0 0 258 258"
      overflow="visible"
      className={cn(className)}>
      <motion.path
        transform="translate(60 85)"
        d="M3 50L45 92L134 3"
        fill="transparent"
        strokeLinecap={"round"}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration, delay, ease: "easeOut" }}
        className={cn(className)}
      />

      <motion.path
        d="M 130 6 C 198.483 6 254 61.517 254 130 C 254 198.483 198.483 254 130 254 C 61.517 254 6 198.483 6 130 C 6 61.517 61.517 6 130 6 Z"
        fill="transparent"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration, delay, ease: "easeOut" }}
        className={cn(className)}
      />
    </motion.svg>
  );
};

export default CircularCheckMark;
