import type { InputHTMLAttributes } from "react";

interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const CheckBox = ({ label, id, ...props }: CheckBoxProps) => {
  return (
    <div className="flex items-center gap-2">
      <input
        id={id}
        type="checkbox"
        className="checked:bg-damul-main-300 peer focus:ring-damul-main-300 flex size-4 cursor-pointer appearance-none items-center justify-center rounded-sm border border-neutral-300 bg-[url(assets/images/jam-check.svg)] bg-center bg-no-repeat text-sm transition-colors duration-300 checked:border-transparent focus:border-transparent focus:ring focus:outline-none dark:bg-[url(assets/images/jam-check-dark.svg)] dark:checked:text-neutral-800"
        {...props}
      />
      {label && (
        <label
          htmlFor={id}
          className="peer-checked:text-damul-main-300 select-none dark:text-white">
          {label}
        </label>
      )}
    </div>
  );
};

export default CheckBox;
