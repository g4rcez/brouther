import { asyncComponent, createRecordRouter } from "brouther";
import { Fragment } from "react";
import { ErrorElementExample } from "./pages/routers/error-element";

export const router = createRecordRouter({
    actions: { path: "/form/actions", element: asyncComponent(() => import("./pages/form/actions")) },
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
    examples: { path: "/examples", element: <Fragment /> },
    form: { path: "/form", element: asyncComponent(() => import("./pages/form/form")) },
    hooks: { path: "/hooks", element: <Fragment /> },
    index: { path: "/", element: asyncComponent(() => import("./pages/index")) },
    install: { path: "/install", element: asyncComponent(() => import("./pages/install")) },
    linkComponent: { path: "/components/link", element: asyncComponent(() => import("./pages/link")) },
    loaders: { path: "/form/loaders", element: asyncComponent(() => import("./pages/form/loaders")) },
    paths: { path: "/paths", element: <Fragment /> },
    queryString: { path: "/query-string", element: <Fragment /> },
    tricksAndTips: { path: "/form/tricks-and-tips", element: asyncComponent(() => import("./pages/form/tricks")) },
    usePage: { path: "/hooks/use-page", element: asyncComponent(() => import("./pages/hooks/use-page")) },
    useNavigation: { path: "/hooks/use-navigation", element: asyncComponent(() => import("./pages/hooks/use-page")) },
    errorElement: {
        path: "/routers/error-element",
        errorElement: <ErrorElementExample />,
        element: asyncComponent(() => import("./pages/routers/error-element")),
    },
    scroll: { path: "/components/scroll", element: asyncComponent(() => import("./pages/scroll")) },
    await: { path: "/components/await", element: asyncComponent(() => import("./pages/await")) },
    outlet: { path: "/components/outlet", element: asyncComponent(() => import("./pages/outlet")) },
    playground: { path: "/playground", element: asyncComponent(() => import("./pages/playground/main-playground")) },
} as const);
