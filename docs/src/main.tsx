import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AppShell } from "./components/app-shell";
import { Brouther, Outlet, Scroll, useHref } from "brouther";
import { router } from "./router";

const NotFound = () => {
    const href = useHref();
    return (
        <section className="mx-auto container w-full">
            <h2 className="text-2xl font-black">Not Found</h2>
            <p>{href}</p>
        </section>
    );
};

const Root = () => {
    return (
        <AppShell>
            <Outlet />
        </AppShell>
    );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <React.Suspense fallback={<React.Fragment />}>
            <Brouther ErrorElement={<NotFound />} config={router.config}>
                <Scroll behavior="smooth">
                    <Root />
                </Scroll>
            </Brouther>
        </React.Suspense>
    </React.StrictMode>
);
