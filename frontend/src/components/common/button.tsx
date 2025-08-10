import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/style";

const buttonVariants = cva(
  "cursor-pointer rounded-xl px-5 py-3 md:text-lg font-bold text-white dark:text-white transition-color duration-300 disabled:bg-neutral-200 dark:disabled:bg-neutral-300",
  {
    variants: {
      variant: {
        default:
          "bg-damul-main-300 dark:bg-damul-main-400 hover:bg-damul-main-400 dark:hover:bg-damul-main-500",
        dangerous: "bg-red-400 hover:bg-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = ({ className, children, variant, ...props }: ButtonProps) => {
  return (
    <button className={cn(buttonVariants({ variant }), className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
