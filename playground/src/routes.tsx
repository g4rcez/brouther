import { createRouter } from "../../src";
import Root from "./pages/root";
import UserIdAddress from "./pages/user-id-address";
import { lazy } from "react";
import { HasQueryString } from "../../src/types";

const Users = lazy(() => import("./pages/users"));

export const { config, navigation, ...router } = createRouter([
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
    {
        path: "/posts/:title?language=string[]!",
        id: "post",
        element: <Users />,
    },
] as const);

export const linkToPosts = router.link(
    router.links.post,
    {
        title: "a",
    },
    {
        language: ["pt-br"],
    }
);
