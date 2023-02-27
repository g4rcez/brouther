import { createMappedRouter } from "../../src";
import Root from "./pages/root";
import UserIdAddress from "./pages/user-id-address";
import { Fragment, lazy } from "react";

const Users = lazy(() => import("./pages/users"));

const generateData = () => ({ number: Math.random() });

export const router = createMappedRouter({
    index: {
        path: "/",
        element: <Root />,
        data: generateData(),
    },
    addressList: {
        path: "/user/:id/address/?sort=string",
        element: <UserIdAddress />,
        data: generateData(),
    },
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
} as const);


const d = router.config.routes
