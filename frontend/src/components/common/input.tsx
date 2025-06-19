import type { InputHTMLAttributes } from "react";

import { cn } from "@/utils/style";

const Input = ({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={cn(
        "ring-damul-main-300 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 ring-inset placeholder:text-neutral-300 focus:ring-2 focus:outline-none",
        className,
      )}
      {...props}
    />
  );
};

export default Input;
