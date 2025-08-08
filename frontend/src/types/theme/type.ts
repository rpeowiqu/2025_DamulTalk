export type ThemeType = "LIGHT" | "DARK";

export interface ThemeState {
  mode: ThemeType;
}

export interface ThemeDispatch {
  toggleTheme: () => void;
}
