import {
  createContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";

import type { ThemeDispatch, ThemeState, ThemeType } from "@/types/theme/type";

export const ThemeStateContext = createContext<ThemeState | null>(null);
export const ThemeDispatchContext = createContext<ThemeDispatch | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setMode] = useState<ThemeType>("LIGHT");

  const toggleTheme = () => {
    setMode((prev) => {
      const newMode = prev === "LIGHT" ? "DARK" : "LIGHT";
      localStorage.setItem("theme", newMode);
      document.documentElement.classList.toggle("dark", newMode === "DARK");

      return newMode;
    });
  };

  useLayoutEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const initialTheme = storedTheme === "DARK" ? "DARK" : "LIGHT";
    document.documentElement.classList.toggle("dark", initialTheme === "DARK");
    setMode(initialTheme);
  }, []);

  return (
    <ThemeStateContext value={{ mode }}>
      <ThemeDispatchContext value={{ toggleTheme }}>
        <div className="dark:text-white">{children}</div>
      </ThemeDispatchContext>
    </ThemeStateContext>
  );
};

export default ThemeProvider;
