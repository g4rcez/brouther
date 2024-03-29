import { createRouter, createRouterMap, Link, usePaths, useQueryString, useUrlSearchParams } from "../src";
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

const ShouldTestUserOrdersTypeOutput = equals(router.link(router.links.user, { id: "1" }), "/users/1/orders?sort=asc");
const ShouldTestUsers = equals(router.link(router.links.user, { id: "1" }), "/users/1");
const ShouldTestOneParameter = equals(router.link(router.links.root), "/");
const ShouldQEqual = equals(
    router.link(router.links.q, {
        q: "2",
        type: "active",
        arr: ["1", "2", "3"],
    }),
    "/search?q=2&type=active&arr=1&arr=2&arr=3"
);

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
console.log(qs.q);
console.log(qs.type);
console.log(qs.arr);
// @ts-expect-error
console.log(qs.error);

const paths = usePaths(router.links.user);
console.log(paths.id);
// @ts-expect-error
console.log(paths.adsas);

const map = createRouterMap({
    atLeastOnlyQs: {
        path: "/:region?lang=string&discount=number&array=number[]&date=date!",
        element: <Fragment />,
    },
    atLeast: {
        path: "/pricing/:region?lang=string!&discount=number",
        element: <Fragment />,
    },
});

console.log(map.link(map.links.atLeast, { region: "Brazil" }, { lang: "cool" }));
const r = map.link(map.links.atLeast, { region: "Brazil" } as const, {
    lang: "lang",
    discount: 1,
});
console.log(r);

const atLeast = map.link(map.links.atLeast, { region: "Brasil" }, { lang: "" });

// @ts-expect-error
const TestLinkQueryString = <Link href="/?query=string!">Link</Link>;

const TestLinkWrongPathType = (
    // @ts-expect-error
    <Link paths={{ id: 1 }} href="/users/:id">
        Link
    </Link>
);

// @ts-expect-error
const TestLinkWithoutPaths = <Link href="/users/:id">Link</Link>;

const RootWithQueryString = (
    <Link href="/?text=string[]!" query={{ text: ["1"] }}>
        Link
    </Link>
);

const TestLinkWithCustomEventHandler = (
    <Link
        paths={{ id: "UUID" }}
        query={{ sort: "sort" }}
        href="/users/:id?sort=string!"
        onClick={(e, queryPaths) => {
            e.preventDefault();
            console.log(queryPaths.query.sort);
            console.log(queryPaths.paths.id);
        }}
    >
        Link
    </Link>
);

console.log(TestLinkWithCustomEventHandler);
