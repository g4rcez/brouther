import { useMemo } from "react";
import { Narrow } from "ts-toolbelt/out/Function/Narrow";
import { Add } from "ts-toolbelt/out/Number/Add";
import { ConfiguredRoute, ExtractPathname, ExtractPaths, QueryString, Route, UrlParams } from "./types";
import { mergeUrlEntities, trailingOptionalPath, transformData, urlEntity } from "./utils";
import { useQueryString, useRouter, useUrlSearchParams } from "./brouther";

type Links<T extends readonly Route[], C extends number = 0> = C extends T["length"]
    ? {}
    : {
          [K in T[C]["id"]]: T[C]["path"];
      } & Links<T, Add<C, 1>>;

const createLink =
    <T extends Narrow<Route[]>>(_routes: T) =>
    <
        Path extends ExtractPaths<T>,
        QS extends UrlParams<ExtractPathname<Path>> extends null ? QueryString<Path> : UrlParams<ExtractPathname<Path>>,
        Params extends UrlParams<ExtractPathname<Path>> extends null ? null : UrlParams<Path>
    >(
        ...args: Params extends null ? [path: Path, qs: QS] : [path: Path, params: Params, qs: QS]
    ): string =>
        mergeUrlEntities(args[0], args[1], args[2]);

const createUseParams =
    <T extends Narrow<Route[]>>(_routes: T) =>
    <Path extends ExtractPaths<T>>(_path: Path): UrlParams<ExtractPathname<Path>> =>
        useRouter().params;

const createUseQueryString =
    <T extends Narrow<Route[]>>(_routes: T) =>
    <Path extends ExtractPaths<T>>(_path: Path): QueryString<Path> =>
        useQueryString<QueryString<Path>>();

const configureRoutes = (arr: Route[]): ConfiguredRoute[] =>
    arr
        .sort((a, b) => {
            if (a.path === b.path) return 0;
            if (a.path.includes("/:") || b.path.includes("/:")) return -1;
            return 1;
        })
        .map((x) => {
            const u = urlEntity(x.path);
            const path = trailingOptionalPath(u.pathname);
            const pathReplace = path.replace(/:\w+/, (t) => `(?<${t.replace(/^:/g, "")}>[^/:])`);
            const regex = new RegExp(`^${pathReplace}$`);
            return {
                path,
                regex,
                id: x.id,
                element: x.element,
                originalPath: x.path,
            };
        });

export const createRouter = <T extends readonly Route[]>(routes: Narrow<Readonly<T>>) => ({
    routes: configureRoutes(routes as Route[]),
    link: createLink(routes as Route[]),
    useParams: createUseParams(routes as Route[]),
    useQueryString: createUseQueryString(routes as Route[]),
    links: (routes as Route[]).reduce((acc, el) => ({ ...acc, [el.id]: el.path }), {} as Links<T>),
});
