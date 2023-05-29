import { asyncActions, asyncComponent, asyncLoader, Brouther, createMappedRouter, createRoute, createRouter } from "../../src";
import UserIdAddress from "./pages/user-id-address";
import { Fragment, lazy } from "react";

const Users = lazy(() => import("./pages/users"));

const generateData = () => ({ text: Math.random().toString() });

export const router = createMappedRouter({
    index: createRoute("/?number=number", {
        element: asyncComponent(() => import("./pages/root/root")),
        loader: asyncLoader<"/?number=number">(() => import("./pages/root/root")),
        actions: asyncActions<"/?number=number">(() => import("./pages/root/root")),
    }),
    addressList: createRoute("/user/:id/address/?sort=string", { element: <UserIdAddress /> }),
    users: { path: "/users?id=number&date=date[]!", element: <Users />, data: generateData() },
    post: { path: "/posts/<id:number>?language=number!", element: <Users />, data: generateData() },
    double: { path: "/posts/<id:string>/status/:status?language=number!", element: <Fragment />, data: generateData() },
    withoutQs: { path: "/posts/<id:number>/status/:status", element: <Fragment />, data: generateData() },
} as const);

const a = router.link(router.links.addressList, { id: "id" });
const b = router.link(router.links.index, { number: 1 });
const c = router.link(router.links.post, { id: 1 });
const users = router.link(router.links.double, { id: "1", status: "aaa" } as const, { language: 1 } as const);
const withoutQs = router.link(router.links.withoutQs, { id: 200, status: "1" } as const);

export const router2 = createRouter([
    {
        id: "double",
        path: "/posts/:id/status/:status?language=number!",
        element: <Fragment />,
        data: generateData(),
        loader: async (args: any) => {
            return new Response("");
        },
    },
    createRoute(
        "/posts/:id/?language=string!",
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
const e = <Brouther config={router2.config} />;
