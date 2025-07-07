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
        className="checked:bg-damul-main-300 peer focus:ring-damul-main-300 flex size-4 cursor-pointer appearance-none items-center justify-center rounded-sm border border-neutral-300 bg-[url(assets/images/jam_check.svg)] bg-center bg-no-repeat text-sm text-white transition-colors duration-300 checked:border-transparent checked:text-white focus:ring focus:outline-none"
        {...props}
      />
      {label && (
        <label
          htmlFor={id}
          className="peer-checked:text-damul-main-400 select-none">
          {label}
        </label>
      )}
    </div>
  );
};

export default CheckBox;
