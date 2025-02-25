import { Fragment } from "react";
import { createRouterMap, lazyRoute, Link, ParseSerializable, Paths } from "../src";

const equals = <A extends any, B extends A>(a: A, b: B): a is B => a === b;

type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

type Merge<T> = { [K in keyof T]: T[K] } & {};

const map = createRouterMap({
    custom: lazyRoute("/testing/:id?lang=string", () => import("../docs/src/pages/brouther"), {
        loadingElement: <Fragment />,
        data: { testing: 123, group: "COOL" },
    }),
    customPattern: {
        path: "/<region:string>?lang=string",
        element: <Fragment />,
    },
    atLeastOnlyQs: {
        path: "/:region?lang=string&discount=number&array=number[]&date=date!",
        element: <Fragment />,
    },
    atLeast: {
        path: "/pricing/:region?lang=string!&discount=number",
        element: <Fragment />,
    },
});

const links = map.links;

const a = map.link(map.links.atLeast, { region: "1" });

console.log(map.link(map.links.customPattern, { region: "string" }, { lang: "123" }));

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

type A = Paths.Has<"/users/<id:string>">;

const TestWithCustomPatternForParams = (
    <Link
        paths={{ id: "UUID" }}
        query={{ sort: "sort" }}
        href="/users/<id:string>"
        onClick={(e, queryPaths) => {
            e.preventDefault();
            console.log(queryPaths.query.sort);
            console.log(queryPaths.paths.id);
        }}
    >
        Link
    </Link>
);

type WillBeParsed = Merge<
    ParseSerializable<{
        date: Date;
        dates: Date[];
        text: string;
    }>
>;

console.log(TestLinkWithCustomEventHandler);

type TestingParser = Equals<WillBeParsed, { text: string; date: string; dates: string[] }>;
