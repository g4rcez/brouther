import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AppShell } from "./components/app-shell";
import { Brouther, usePage } from "brouther";
import { router } from "./router";

const Root = () => {
    const page = usePage();
    return <AppShell>{page}</AppShell>;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <React.Suspense fallback={<React.Fragment />}>
            <Brouther config={router.config}>
                <Root />
            </Brouther>
        </React.Suspense>
    </React.StrictMode>
);
