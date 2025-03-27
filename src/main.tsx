import React from "react";
import App from "./App.tsx";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { Toaster } from "sonner";
import { getTheme } from "./theme";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/theme-context.tsx";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

const AppWrapper = () => {
  const { mode } = useTheme();
  const theme = getTheme(mode);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <App />
      </BrowserRouter>
    </MuiThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AppWrapper />
    </ThemeProvider>
  </React.StrictMode>
);
