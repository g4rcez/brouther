import { asyncActions, GetPaths, asyncComponent, asyncLoader, createMappedRouter, createPaths, createRoute, Link } from "../../src";
import BlogPage from "./pages/blog";
import { useRouteError } from "../../src/brouther/brouther";

const paths = createPaths({ index: "/?firstName=string&lastName=string&date=Date" });

type Paths = GetPaths<typeof paths>;

type IndexRoute = Paths["index"];

const ErrorElement = () => {
    const [error] = useRouteError();
    return (
        <p>
            Fail...Error Boom <Link href={"/blog"}>Go to Blog</Link>
        </p>
    );
};

export const router = createMappedRouter({
    [paths.index.name]: createRoute(paths.index.value, {
        errorElement: <ErrorElement />,
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
