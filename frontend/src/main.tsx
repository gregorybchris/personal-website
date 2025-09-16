import "@fontsource/noto-serif-tc";
import "@fontsource/noto-serif-tc/300.css";
import "@fontsource/noto-serif-tc/400.css";
import "@fontsource/noto-serif-tc/500.css";
import "@fontsource/noto-serif-tc/600.css";
import "@fontsource/raleway";
import "@fontsource/raleway/300.css";
import "@fontsource/raleway/400.css";
import "@fontsource/raleway/500.css";
import "@fontsource/raleway/600.css";
import "@fontsource/sanchez";
import "./main.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
