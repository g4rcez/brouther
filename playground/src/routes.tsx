import { asyncActions, asyncComponent, asyncLoader, createMappedRouter, createPaths, createRoute } from "../../src";
import BlogPage from "./pages/blog";

export const router = createMappedRouter({
    index: createRoute("/?number=number", {
        element: asyncComponent(() => import("./pages/root")),
        loader: asyncLoader<"/?number=number">(() => import("./pages/root")),
        actions: asyncActions<"/?number=number">(() => import("./pages/root")),
    }),
    blog: createRoute("/blog?sort=string", { element: <BlogPage /> }),
} as const);

