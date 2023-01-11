import { createRouter } from "../../src";
import Root from "./pages/root";
import UserIdAddress from "./pages/user-id-address";
import { lazy } from "react";

const Users = lazy(() => import("./pages/users"));

export const { config, history, ...router } = createRouter([
    {
        path: "/",
        id: "index",
        element: <Root />,
    },
    {
        path: "/user/:id/address/?sort=string",
        id: "addressList",
        element: <UserIdAddress />,
    },
    {
        path: "/users?id=number!",
        id: "users",
        element: <Users />,
    },
] as const);

console.log(config);
