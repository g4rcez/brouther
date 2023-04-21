import { createMappedRouter } from "../../src";
import Root from "./pages/root";
import UserIdAddress from "./pages/user-id-address";
import { Fragment, lazy } from "react";
import { createRoute } from "../../src/router";
import { BroutherResponse } from "../../src/brouther-response";

const Users = lazy(() => import("./pages/users"));

const generateData = () => ({ text: Math.random().toString() });

export const router = createMappedRouter(
    {
        index: createRoute("/?numbers=number[]!", <Root />, {
            data: generateData(),
            loader: async (args) =>
                BroutherResponse.json({
                    any: Math.random(),
                    data: args.data,
                    paths: args.paths,
                    queryString: args.queryString,
                }),
            actions: {
                post: async (args) => {
                    const url = new URL(args.request.url);
                    const json = await args.request.json();
                    console.log(["->"], json);
                    url.searchParams.set("numbers", Math.random().toString());
                    return BroutherResponse.redirect(url.href);
                },
            },
        }),
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
    } as const,
    "/"
);
