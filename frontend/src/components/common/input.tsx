import {
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type RefObject,
} from "react";
import { EyeIcon, EyeOffIcon, XCircleIcon } from "lucide-react";

import { cn } from "@/utils/style";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: RefObject<HTMLInputElement | null>;
}

const Input = ({
  ref,
  type,
  defaultValue,
  className,
  onChange,
  ...props
}: InputProps) => {
  const innerRef = useRef<HTMLInputElement>(null);

  // props로 값을 넘겨줄 경우 해당 값을 사용하고 그렇지 않으면 내부에서 선언한 값을 사용
  const inputRef = ref ?? innerRef;

  const [isEmpty, setIsEmpty] = useState(!defaultValue);
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Mac에서 한글이 두 번 입력되는 문제 방지
    if ((e.nativeEvent as InputEvent).isComposing) {
      return;
    }

    setIsEmpty(e.target.value.length === 0);
    onChange?.(e);
  };

  const handleClear = () => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.value = "";

    // input에게 값을 비웠음을 알린다.
    // 만약 외부에서 value와 setState로 연결할 경우 onChange를 호출하여 value도 비워야 하기 때문에 필요!
    handleChange({
      target: { value: "" },
    } as ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="focus-within:ring-damul-main-300 flex w-full items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 ring-inset focus-within:border-transparent focus-within:ring-2 dark:border-neutral-500 dark:bg-neutral-700 dark:text-white">
      <input
        ref={inputRef}
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        defaultValue={defaultValue}
        className={cn(
          "w-full placeholder:text-neutral-300 focus:outline-none",
          className,
        )}
        onChange={handleChange}
        {...props}
      />

      {!isEmpty && (
        <div className="flex shrink-0 gap-3">
          {type === "password" && (
            <button
              type="button"
              className="cursor-pointer text-neutral-300 dark:text-white"
              onClick={handleShowPassword}>
              {showPassword ? (
                <EyeIcon className="size-5" />
              ) : (
                <EyeOffIcon className="size-5" />
              )}
            </button>
          )}

          <button
            type="button"
            className="cursor-pointer text-neutral-300 dark:text-white"
            onClick={handleClear}>
            <XCircleIcon className="size-5 fill-neutral-300 stroke-white dark:fill-neutral-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Input;
