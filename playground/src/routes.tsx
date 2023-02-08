import { createMappedRouter, createRouter } from "../../src";
import Root from "./pages/root";
import UserIdAddress from "./pages/user-id-address";
import { Fragment, lazy } from "react";

const Users = lazy(() => import("./pages/users"));

export const router = createMappedRouter({
    index: {
        path: "/",
        element: <Root />,
    },
    addressList: {
        path: "/user/:id/address/?sort=string",
        element: <UserIdAddress />,
    },
    users: {
        path: "/users?id=number&date=date[]!",
        element: <Users />,
    },
    post: {
        path: "/posts/:id?language=number!",
        element: <Users />,
    },
    double: {
        path: "/posts/:id/status/:status?language=number!",
        element: <Fragment />,
    },
} as const);

export const linkToPosts = router.link(router.links.double, { status: "ok", id: "9999" }, { language: 5 });

export const routerArray = createRouter([
    { path: "/users", id: "users", element: <Fragment /> },
    { path: "/post/:id", id: "post", element: <Fragment /> },
    { path: "/blog/:tenant?posts=string!", id: "blog", element: <Fragment /> },
    { path: "/", id: "root", element: <Fragment /> },
]);

const a = routerArray.link(routerArray.links.blog, { tenant: "cool" }, { posts: "asc" });
