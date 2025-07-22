import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/utils/style";

const TextArea = ({
  value,
  className,
  maxLength,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <div className="focus-within:ring-damul-main-300 mt-2 flex h-52 w-full flex-col gap-3 rounded-xl p-4 ring-2 ring-neutral-100">
      <textarea
        value={value}
        className={cn(
          "size-full resize-none whitespace-pre-wrap placeholder-neutral-300 outline-none",
          className,
        )}
        maxLength={maxLength}
        {...props}
      />
      {value && (
        <p
          className={cn(
            "text-end text-sm text-neutral-400",
            maxLength &&
              value.toString().length >= maxLength &&
              "font-bold text-red-400",
          )}>
          {value.toString().length} / {maxLength}
        </p>
      )}
    </div>
  );
};

export default TextArea;
