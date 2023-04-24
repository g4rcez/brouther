import { asyncActions, asyncLoader, createMappedRouter, createRoute, createRouter, jsonResponse } from "../../src";
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
});

const a = router.link(router.links.addressList, { id: "id" }, { sort: "asc" });
const b = router.link(router.links.index, { number: 1 });
const users = router.link(router.links.double, { id: "af", status: "active" }, { language: 1 });
const c = router.links;

export const router2 = createRouter([
    {
        id: "double",
        path: "/posts/:id/status/:status?language=number!",
        loader: asyncLoader(() => import("./pages/root")),
        element: <Fragment />,
        data: generateData(),
    },
]);

const d = router2.links.double;
const users2 = router2.link(router2.links.double, { id: "af", status: "active" }, { language: 1 });
