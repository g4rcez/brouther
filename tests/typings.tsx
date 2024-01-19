import { Fragment } from "react";
import { createRouterMap, Link } from "../src";

const equals = <A extends any, B extends A>(a: A, b: B): a is B => a === b;

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
