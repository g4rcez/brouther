import { asyncActions, asyncLoader, createMappedRouter, createRoute, createRouter } from "../../src";
import UserIdAddress from "./pages/user-id-address";
import { Fragment, lazy } from "react";
import { asyncComponent } from "../../src/router/router";

const Users = lazy(() => import("./pages/users"));

const generateData = () => ({ text: Math.random().toString() });

export const router = createMappedRouter({
    index: createRoute("/?number=number", {
        element: asyncComponent(() => import("./pages/root")),
        loader: asyncLoader<"/?number=number">(() => import("./pages/root")),
        actions: asyncActions<"/?number=number">(() => import("./pages/root")),
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
        element: <Fragment />,
        data: generateData(),
    },
});

const a = router.link(router.links.addressList, { id: "id" });
const b = router.link(router.links.index, { number: 1 });
const users = router.link(router.links.double, { id: "af", status: "active" } , { language: 1 });

export const router2 = createRouter([
    {
        id: "double",
        path: "/posts/:id/status/:status?language=number!",
        element: <Fragment />,
        data: generateData(),
        loader: async (args: any) => {},
    },
    createRoute(
        "/posts/:id/?language=string",
        {
            id: "id",
            element: <Fragment />,
            data: generateData(),
            loader: async (args) => {
                return new Response(null);
            },
        },
        {}
    ),
]);

const users2 = router2.link(router2.links.double, { id: "as", status: "active" }, { language: 1 });
