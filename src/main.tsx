import React from "react";
import App from "./App.tsx";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1E26DF", // primary blue color
    },
    background: {
      default: "#F5F7FA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A202C",
      secondary: "#4A5568",
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600,
    },
    h3: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600,
    },
    h4: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 500,
    },
    h5: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 500,
    },
    h6: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 500,
    },
    subtitle1: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 500,
    },
    subtitle2: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 500,
    },
    body1: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 400,
    },
    body2: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 400,
    },
    button: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 500,
      textTransform: "none",
    },
    caption: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 400,
    },
    overline: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          padding: "10px 20px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: "'Poppins', sans-serif",
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
