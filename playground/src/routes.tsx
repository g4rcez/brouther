import { createRouter } from "brouther";

export const { routes, ...router } = createRouter([
    {
        path: "/",
        id: "index",
        element: <p>Root Index Page</p>,
    },
    {
        path: "/users?id=number!",
        id: "users",
        element: <p>Users</p>,
    },
] as const);
