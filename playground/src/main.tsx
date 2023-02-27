import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Brouther } from "../../src";
import { router } from "./routes";

type A = typeof router.config;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <React.Suspense fallback={<div>Loading...</div>}>
            <Brouther<A>
                config={router.config}
                filter={(route, c) => {
                    const r = route.data;
                    return true;
                }}
            >
                <App />
            </Brouther>
        </React.Suspense>
    </React.StrictMode>
);
