import { Fragment } from "react";
import { DocumentPage } from "./components/document-page";
import { asyncActions, asyncComponent, asyncLoader, createRouter, lazyRoute, Link, useRouteError } from "./exports";

const ErrorElementExample = () => {
    const [error] = useRouteError();
    return (
        <DocumentPage title="Error element">
            <p>Error name {error?.name}</p>
            <p>
                <Link href={router.links.index}>Back to root</Link>
            </p>
        </DocumentPage>
    );
};

export const router = createRouter(
    {
        index: lazyRoute("/?ref=string&date=string", async () => import("./pages/index"), {
            data: { breadcrumb: [], group: "root" },
        }),
        actions: lazyRoute("/form/actions", () => import("./pages/form/actions")),
        decisions: lazyRoute("/decision-records", () => import("./pages/decision-records")),
        aliases: { path: "/route-alias", element: <Fragment /> },
        basicSetup: { path: "/basic-setup", element: asyncComponent(() => import("./pages/basic-setup")) },
        brouther: { path: "/components/brouther", element: asyncComponent(() => import("./pages/brouther")) },
        createMappedRouter: {
            path: "/routers/create-mapped-router",
            element: asyncComponent(() => import("./pages/routers/create-mapped-router")),
        },
        createRouter: lazyRoute("/routers/create-router", () => import("./pages/routers/create-router")),
        scrollTest: lazyRoute("/scroll", () => import("./pages/scroll-test")),
        playground: lazyRoute("/playground?type=string", () => import("./pages/playground/main-playground"), {
            loadingElement: (
                <div className="flex justify-center items-center p-10 w-full h-full">Loading playground...</div>
            ),
        }),
        form: {
            path: "/form",
            element: asyncComponent(() => import("./pages/form/form")),
            data: {
                number: 1,
            },
        },
        hooks: { path: "/hooks", element: <Fragment /> },
        install: { path: "/install", element: asyncComponent(() => import("./pages/install")) },
        linkComponent: { path: "/components/link", element: asyncComponent(() => import("./pages/link")) },
        loaders: { path: "/form/loaders", element: asyncComponent(() => import("./pages/form/loaders")) },
        paths: { path: "/paths", element: <Fragment /> },
        queryString: { path: "/query-string", element: <Fragment /> },
        tricksAndTips: { path: "/form/tricks-and-tips", element: asyncComponent(() => import("./pages/form/tricks")) },
        usePage: { path: "/hooks/use-page", element: asyncComponent(() => import("./pages/hooks/use-page")) },
        usePaths: { path: "/hooks/use-paths", element: asyncComponent(() => import("./pages/hooks/use-paths")) },
        useNavigation: {
            path: "/hooks/use-navigation",
            element: asyncComponent(() => import("./pages/hooks/use-navigation")),
        },
        errorElement: {
            path: "/routers/error-element",
            errorElement: <ErrorElementExample />,
            element: asyncComponent(() => import("./pages/routers/error-element")),
        },
        scroll: { path: "/components/scroll", element: asyncComponent(() => import("./pages/scroll")) },
        await: { path: "/components/await", element: asyncComponent(() => import("./pages/await")) },
        outlet: { path: "/components/outlet", element: asyncComponent(() => import("./pages/outlet")) },
        test: {
            path: "/test/:uuid?type=string",
            element: asyncComponent(() => import("./pages/playground/main-playground")),
        },
        loaderTest: {
            path: "/playground/loader",
            element: asyncComponent(() => import("./pages/playground/loader")),
            loader: asyncLoader(() => import("./pages/playground/loader")),
            actions: asyncActions(() => import("./pages/playground/loader")),
        },
    } as const,
    "/"
);
