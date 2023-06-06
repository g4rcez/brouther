import { asyncActions, GetPaths, asyncComponent, asyncLoader, createMappedRouter, createPaths, createRoute } from "../../src";
import BlogPage from "./pages/blog";

const paths = createPaths({
    index: "/?firstName=string&lastName=string&date=Date",
});

type Paths = GetPaths<typeof paths>;

type IndexRoute = Paths["index"];

export const router = createMappedRouter({
    [paths.index.name]: createRoute(paths.index.value, {
        element: asyncComponent(() => import("./pages/root")),
        loader: asyncLoader<IndexRoute>(() => import("./pages/root")),
        actions: asyncActions<IndexRoute>(() => import("./pages/root")),
    }),
    blog: createRoute("/blog?sort=string", { element: <BlogPage />, loader: asyncLoader(() => import("./pages/blog")) }),
    users: createRoute("/users?sort=string", { element: asyncComponent(() => import("./pages/users")) }),
    user: createRoute("/user/<id:string>?sort=string", {
        loader: asyncLoader(() => import("./pages/user")),
        element: asyncComponent(() => import("./pages/user")),
    }),
} as const);
