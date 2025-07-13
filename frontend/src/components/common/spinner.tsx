import { cn } from "@/utils/style";

interface SpinnerProps {
  className?: string;
}

const Spinner = ({ className }: SpinnerProps) => {
  return (
    <div
      className={cn(
        "border-damul-main-300 size-6 animate-spin rounded-full border-2 border-r-neutral-200 border-b-neutral-200 border-l-neutral-200 bg-none",
        className,
      )}
    />
  );
};

export default Spinner;
