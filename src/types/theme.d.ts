import { Theme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    mode: "light" | "dark";
  }
  interface ThemeOptions {
    mode?: "light" | "dark";
  }
}
