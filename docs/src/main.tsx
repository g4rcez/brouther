import { Brouther, RouteEvents, Outlet, Scroll, useHref } from "./exports";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AppShell } from "./components/app-shell";
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

const Root = () => (
    <AppShell>
        <Outlet
            notFound={
                <p className="p-14">
                    Not found route... <b>{window.location.pathname}</b>
                </p>
            }
        />
    </AppShell>
);

const flags = { openExternalLinksInNewTab: true };

RouteEvents.on("notFound", (url) => {
    console.log("not found path:", url);
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <React.Suspense fallback={<React.Fragment />}>
            <Brouther flags={flags} ErrorElement={<NotFound />} config={router.config}>
                <Scroll behavior="smooth">
                    <Root />
                </Scroll>
            </Brouther>
        </React.Suspense>
    </React.StrictMode>
);
