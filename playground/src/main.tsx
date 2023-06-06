import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Brouther } from "../../src";
import { router } from "./routes";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <React.Suspense fallback={<div>Loading...</div>}>
            <Brouther config={router.config}>
                <App />
            </Brouther>
        </React.Suspense>
    </React.StrictMode>
);
