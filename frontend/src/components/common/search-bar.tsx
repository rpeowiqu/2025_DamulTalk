import {
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from "react";
import { XCircleIcon } from "lucide-react";

import SearchIcon from "@/components/icon/search-icon";
import { cn } from "@/utils/style";

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (_keyword: string) => void;
  onChangeKeyword?: (_keyword: string) => void;
}

const SearchBar = ({
  onSearch,
  onChangeKeyword,
  className,
  ...props
}: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setIsEmpty(keyword.length === 0);
    onChangeKeyword?.(keyword);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Mac에서 두 번 입력되는 문제 방지
    if (e.nativeEvent.isComposing) {
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      // 검색 시 호출할 이벤트를 등록한 경우에만 실행
      if (onSearch && inputRef.current) {
        const keyword = inputRef.current.value.trim();
        inputRef.current.value = "";
        handleChange({
          target: { value: "" },
        } as ChangeEvent<HTMLInputElement>);
        onSearch(keyword);
      }
    }
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
    <div className="group focus-within:ring-damul-main-300 flex w-full items-center gap-3 rounded-xl bg-neutral-100 px-4 py-3 ring-inset focus-within:bg-white focus-within:ring-2 dark:bg-neutral-600 dark:text-white dark:focus-within:bg-neutral-800">
      <SearchIcon
        className={cn(
          "group-focus-within:text-damul-main-300 shrink-0 text-neutral-300",
        )}
      />
      <input
        ref={inputRef}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        className={cn(
          "w-full flex-1 placeholder:text-neutral-300 focus:outline-none",
          className,
        )}
        {...props}
      />
      {!isEmpty && (
        <button
          type="button"
          className="shrink-0 cursor-pointer text-neutral-300 dark:text-white"
          onClick={handleClear}>
          <XCircleIcon className="size-5 fill-neutral-300 stroke-white dark:fill-neutral-600" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
