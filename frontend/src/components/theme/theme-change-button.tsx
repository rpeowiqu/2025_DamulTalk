import { useContext } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

import {
  ThemeDispatchContext,
  ThemeStateContext,
} from "@/contexts/theme/theme-provider";
import { cn } from "@/utils/style";

interface ThemeChangeButtonProps {
  className?: string;
}

const ThemeChangeButton = ({ className }: ThemeChangeButtonProps) => {
  const { mode } = useContext(ThemeStateContext)!;
  const { toggleTheme } = useContext(ThemeDispatchContext)!;

  return (
    <button
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-lg text-white transition-colors duration-200",
        className,
      )}
      onClick={toggleTheme}>
      {mode === "LIGHT" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

export default ThemeChangeButton;
