import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AppShell } from "./components/app-shell";
import { Brouther, useHref, usePage } from "brouther";
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
    const page = usePage();
    return <AppShell>{page === null ? <NotFound /> : page}</AppShell>;
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
