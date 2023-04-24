import { asyncActions, asyncLoader, createMappedRouter, createRoute } from "../../src";
import Root from "./pages/root";
import UserIdAddress from "./pages/user-id-address";
import { Fragment, lazy } from "react";

const Users = lazy(() => import("./pages/users"));

const generateData = () => ({ text: Math.random().toString() });

export const router = createMappedRouter({
    index: createRoute("/?number=number", {
        element: <Root />,
        loader: asyncLoader(() => import("./pages/root")),
        actions: asyncActions(() => import("./pages/root")),
    }),
    addressList: createRoute("/user/:id/address/?sort=string", { element: <UserIdAddress /> }),
    users: {
        path: "/users?id=number&date=date[]!",
        element: <Users />,
        data: generateData(),
    },
    post: {
        path: "/posts/:id?language=number!",
        element: <Users />,
        data: generateData(),
    },
    double: {
        path: "/posts/:id/status/:status?language=number!",
        loader: asyncLoader(() => import("./pages/root")),
        element: <Fragment />,
        data: generateData(),
    },
} as const);

const a = router.link(router.links.addressList, { id: "id" }, { sort: "asc" });
const b = router.link(router.links.index, { number: 1 });
const users = router.link(router.links.double, { id: "af", status: "active" }, { language: 1 });
const c = router.links;
