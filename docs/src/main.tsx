import { Brouther, RouteEvents, Outlet, Scroll, useHref } from "./exports";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AppShell } from "./components/app-shell";
import { router } from "./router";

const NotFound = () => {
    const href = useHref();
    return (
        <section className="container mx-auto w-full">
            <h2 className="text-2xl font-black">Not Found</h2>
            <p>{href}</p>
        </section>
    );
};

const Root = () => (
    <AppShell>
        <React.Suspense fallback={<React.Fragment />}>
            <Outlet
                notFound={
                    <p className="p-14">
                        Not found route... <b>{window.location.pathname}</b>
                    </p>
                }
            />
        </React.Suspense>
    </AppShell>
);

const flags = { openExternalLinksInNewTab: true };

RouteEvents.on("notFound", (url) => {
    console.log("not found path:", url);
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Brouther flags={flags} ErrorElement={<NotFound />} config={router.config}>
            <Scroll behavior="smooth">
                <Root />
            </Scroll>
        </Brouther>
    </React.StrictMode>
);
