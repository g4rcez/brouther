import { createRouter, usePaths, useQueryString, useUrlSearchParams } from "../src";
import { Fragment } from "react";

const equals = <A extends any, B extends A>(a: A, b: B): a is B => a === b;

const router = createRouter([
    {
        element: <Fragment />,
        path: "/",
        id: "root",
    },
    {
        element: <Fragment />,
        path: "/users",
        id: "users",
    },
    {
        element: <Fragment />,
        path: "/users/:id",
        id: "user",
    },
    {
        element: <Fragment />,
        path: "/users/:id/orders?sort=string!",
        id: "userOrders",
    },
    {
        element: <Fragment />,
        path: "/search?q=string&type=string&arr=string[]",
        id: "q",
    },
] as const);

const shouldTestExpectedLinks = equals(router.links, {
    root: "/",
    users: "/users",
    user: "/users/:id",
    userOrders: "/users/:id/orders?sort=string!",
    q: "/search?q=string&type=string&arr=string[]",
});

const ShouldTestUserOrdersTypeOutput = equals(router.link(router.links.userOrders, { id: "1" }, { sort: "asc" }), "/users/1/orders?sort=asc");
const ShouldTestUsers = equals(router.link(router.links.user, { id: "1" }), "/users/1");
const ShouldTestOneParameter = equals(router.link(router.links.root), "/");

// @ts-expect-error
const ShouldExpectError = equals(router.link(router.links.root), "/error");

// @ts-expect-error
const ShouldExpectError = equals(router.link(router.links.user, { id: "1" }), "/user/2");

// @ts-expect-error
const shouldTestPartialLinks = equals(router.links, {
    root: "/",
});

const urlSearchParams = useUrlSearchParams<{ key: string; value: string }>();
// @ts-expect-error
urlSearchParams.get("key-not-exist");

const qs = useQueryString(router.links.q);
qs.q;
qs.type;
qs.arr;
// @ts-expect-error
qs.error;

const paths = usePaths(router.links.user);
paths.id;
// @ts-expect-error
paths.adsas;
