import { asyncActions, asyncComponent, asyncLoader, createRoute } from "../../../../src";

export const path = "/?number=number" as const;

export const rootIndexRoute = createRoute(path, {
    loader: asyncLoader(() => import("./root")),
    actions: asyncActions(() => import("./root")),
    element: asyncComponent(() => import("./root")),
});
