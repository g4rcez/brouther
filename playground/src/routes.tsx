import { asyncActions, asyncComponent, asyncLoader, createMappedRouter, createRoute } from "../../src";
import BlogPage from "./pages/blog";

type IndexRoute = "/?firstName=string&lastName=string&date=Date";

export const router = createMappedRouter({
    index: createRoute("/?firstName=string&lastName=string&date=Date", {
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

router.links.user;
