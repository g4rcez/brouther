import { createMappedRouter } from "../../src";
import Root from "./pages/root";
import UserIdAddress from "./pages/user-id-address";
import { lazy } from "react";

const Users = lazy(() => import("./pages/users"));

export const { config, ...router } = createMappedRouter({
    index: {
        path: "/",
        element: <Root />,
    },
    addressList: {
        path: "/user/:id/address/?sort=string",
        element: <UserIdAddress />,
    },
    users: {
        path: "/users?id=number!",
        element: <Users />,
    },
    post: {
        path: "/posts/:id?language=date[]!",
        element: <Users />,
    },
} as const);

export const linkToPosts = router.link(
    router.links.post,
    {
        id: "1",
    },
    {
        language: [],
    }
);
