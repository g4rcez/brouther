import { createRecordRouter } from "brouther";
import { Fragment, lazy } from "react";

const IndexPage = lazy(() => import("./pages/index"));
const InstallPage = lazy(() => import("./pages/install"));
const BasicSetupPage = lazy(() => import("./pages/basic-setup"));
const CreateRouterPage = lazy(() => import("./pages/routers/create-router"));
const CreateMappedRouterPage = lazy(() => import("./pages/routers/create-mapped-router"));
const BroutherPage = lazy(() => import("./pages/brouther"));

export const router = createRecordRouter({
    index: { path: "/", element: <IndexPage /> },
    brouther: { path: "/components/brouther", element: <BroutherPage /> },
    linkComponent: { path: "/components/link", element: <IndexPage /> },
    basicSetup: { path: "/basic-setup", element: <BasicSetupPage /> },
    install: { path: "/install", element: <InstallPage /> },
    aliases: { path: "/route-alias", element: <Fragment /> },
    hooks: { path: "/hooks", element: <Fragment /> },
    examples: { path: "/examples", element: <Fragment /> },
    queryString: { path: "/query-string", element: <Fragment /> },
    paths: { path: "/paths", element: <Fragment /> },
    createRouter: { path: "/routers/create-router", element: <CreateRouterPage /> },
    createMappedRouter: { path: "/routers/create-mapped-router", element: <CreateMappedRouterPage /> },
} as const);
