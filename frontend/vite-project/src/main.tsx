// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Montserrat font ağırlıklarını import edin
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/700.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1d1d1d",
    },
    primary: {
      main: "#000000",
    },
    text: {
      primary: "#ffffff",
      secondary: "#bbbbbb",
    },
  },
  typography: {
    // Tüm yazılarda Montserrat kullanıyoruz
    fontFamily: `"Montserrat", "Helvetica", "Arial", sans-serif`,
    h4: {
      fontFamily: `"Montserrat", sans-serif`,
      fontWeight: 500,
    },
    button: {
      textTransform: "none",
      fontFamily: `"Montserrat", sans-serif`,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
