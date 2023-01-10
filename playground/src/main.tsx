import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Brouther } from "brouther";
import { routes } from "./routes";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Brouther routes={routes}>
            <App />
        </Brouther>
    </React.StrictMode>
);
