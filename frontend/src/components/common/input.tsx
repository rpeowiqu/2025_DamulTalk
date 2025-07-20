import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";
import { EyeIcon, EyeOffIcon, XCircleIcon } from "lucide-react";

import { cn } from "@/utils/style";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  prefillEmail?: boolean; // type이 email일 때, 로컬스토리지에 값이 있다면 해당 값으로 초기화 할 것인지
}

const Input = ({
  prefillEmail,
  type,
  className,
  onChange,
  ...props
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  useEffect(() => {
    // 타입이 이메일이고, prefillEmail prop이 true인 경우에 로컬 스토리지에 저장되어 있다면 값을 가져온다.
    if (!inputRef.current || !(type === "email") || !prefillEmail) {
      return;
    }

    const savedEmail = localStorage.getItem("saved-email");
    if (savedEmail) {
      inputRef.current.value = savedEmail;
      setIsEmpty(false);
    }
  }, []);

  return (
    <div className="focus-within:ring-damul-main-300 flex items-center gap-4 rounded-xl border border-neutral-200 bg-white px-4 py-3 ring-inset focus-within:ring-2">
      <input
        ref={inputRef}
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        className={cn(
          "flex-1 placeholder:text-neutral-300 focus:outline-none",
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
              className="cursor-pointer text-neutral-300"
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
            className="cursor-pointer text-neutral-300"
            onClick={handleClear}>
            <XCircleIcon className="size-5 fill-neutral-300 stroke-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Input;
