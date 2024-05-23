import { Fragment } from "react";
import { asyncActions, asyncComponent, createRouter } from "brouther";
import { ErrorElementExample } from "./pages/routers/error-element";

export const router = createRouter(
    {
        actions: { path: "/form/actions", element: asyncComponent(() => import("./pages/form/actions")) },
        decisions: { path: "/decision-records", element: asyncComponent(() => import("./pages/decision-records")) },
        aliases: { path: "/route-alias", element: <Fragment /> },
        basicSetup: { path: "/basic-setup", element: asyncComponent(() => import("./pages/basic-setup")) },
        brouther: { path: "/components/brouther", element: asyncComponent(() => import("./pages/brouther")) },
        createMappedRouter: {
            path: "/routers/create-mapped-router",
            element: asyncComponent(() => import("./pages/routers/create-mapped-router")),
        },
        createRouter: {
            path: "/routers/create-router",
            element: asyncComponent(() => import("./pages/routers/create-router")),
        },
        playground: {
            path: "/playground?type=string",
            actions: asyncActions(() => import("./pages/playground/main-playground")),
            element: asyncComponent(() => import("./pages/playground/main-playground")),
        },
        form: {
            path: "/form",
            element: asyncComponent(() => import("./pages/form/form")),
            data: {
                number: 1,
            },
        },
        hooks: { path: "/hooks", element: <Fragment /> },
        index: { path: "/", element: asyncComponent(() => import("./pages/index")) },
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
        test: { path: "/test/:uuid?type=string", element: asyncComponent(() => import("./pages/playground/main-playground")) },
    } as const,
    "/"
);
