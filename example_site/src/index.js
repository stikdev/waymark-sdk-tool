import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import SnackbarProvider from "react-simple-snackbar";

import App from "./components/App";
import { AppProvider } from "./components/AppProvider";

import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <SnackbarProvider>
      <BrowserRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
