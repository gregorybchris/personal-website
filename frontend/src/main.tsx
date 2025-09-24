import "@fontsource-variable/geist-mono";
import "@fontsource/raleway";
import "@fontsource/raleway/300.css";
import "@fontsource/raleway/400.css";
import "@fontsource/raleway/500.css";
import "@fontsource/raleway/600.css";
import "@fontsource/sanchez";
import "./styles/main.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
