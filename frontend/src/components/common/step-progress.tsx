import { Progress, type ProgressProps } from "@/components/ui/progress";
import CheckCircleIcon from "@/components/icon/check-circle-icon";
import { cn } from "@/utils/style";

interface StepProgressProps extends ProgressProps {
  stepCount: number;
  stepLabels?: string[];
  stepClassName?: string;
  stepLabelClassName?: string;
}

const StepProgress = ({
  value = 0,
  stepCount,
  stepLabels,
  stepClassName,
  stepLabelClassName,
  ...props
}: StepProgressProps) => {
  return (
    <div className="relative">
      <div className="flex items-center">
        <CheckCircleIcon className={cn(stepClassName, "fill-none")} />
        <Progress value={value} {...props} />
        <CheckCircleIcon className={cn(stepClassName, "fill-none")} />
      </div>

      <div className="absolute top-1/2 left-0 flex w-full -translate-y-1/2 items-center justify-between">
        {Array.from({ length: stepCount }).map((_, index) => (
          <div key={index} className="relative">
            <CheckCircleIcon
              className={cn(
                value !== null && (100 / stepCount) * index <= value
                  ? "fill-damul-main-300"
                  : "fill-neutral-300",
                stepClassName,
              )}
            />
            {stepLabels && (
              <p
                className={cn(
                  "absolute top-full left-1/2 mt-0.5 -translate-x-1/2 text-sm whitespace-nowrap",
                  value !== null && (100 / stepCount) * index <= value
                    ? "text-damul-main-300"
                    : "text-neutral-300",
                  stepLabelClassName,
                )}>
                {stepLabels[index]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepProgress;
