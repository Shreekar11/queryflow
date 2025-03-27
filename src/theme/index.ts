import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "light" ? "#1E26DF" : "#90caf9",
      },
      secondary: {
        main: mode === "light" ? "#dc004e" : "#f48fb1",
      },
      background: {
        default: mode === "light" ? "#F5F7FA" : "#121212",
        paper: mode === "light" ? "#FFFFFF" : "#1e1e1e",
      },
      text: {
        primary: mode === "light" ? "#1A202C" : "#ffffff",
        secondary: mode === "light" ? "#4A5568" : "#bbbbbb",
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
            boxShadow:
              mode === "light"
                ? "0 4px 20px rgba(0, 0, 0, 0.05)"
                : "0 4px 20px rgba(255, 255, 255, 0.1)",
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: "'Poppins', sans-serif",
            backgroundColor: mode === "light" ? "#F5F7FA" : "#121212",
          },
        },
      },
    },
  });