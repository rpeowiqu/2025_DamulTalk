import type { InputHTMLAttributes, Ref } from "react";

import { cn } from "@/utils/style";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
}

const Input = ({ ref, className, ...props }: InputProps) => {
  return (
    <input
      ref={ref}
      className={cn(
        "ring-damul-main-300 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 ring-inset placeholder:text-neutral-300 focus:ring-2 focus:outline-none",
        className,
      )}
      {...props}
    />
  );
};

export default Input;
