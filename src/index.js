import React from "react";
import ReactDOM from "react-dom";
import SnackbarProvider from "react-simple-snackbar";

import App from "./components/App";

import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
