import { Narrow } from "ts-toolbelt/out/Function/Narrow";
import { Add } from "ts-toolbelt/out/Number/Add";
import { ConfiguredRoute, ExtractPathname, ExtractPaths, HasQueryString, QueryString, QueryStringMappers, Route, UrlParams } from "./types";
import {
    applyBasename,
    mergeUrlEntities,
    remapQueryStringParams,
    trailingOptionalPath,
    transformData,
    urlEntity
} from "./utils";
import { useQueryString, useRouter, useUrlSearchParams } from "./brouther";
import { createBrowserHistory } from "history";
import { useMemo } from "react";

type Links<T extends readonly Route[], C extends number = 0> = C extends T["length"]
    ? {}
    : {
          [K in T[C]["id"]]: T[C]["path"];
      } & Links<T, Add<C, 1>>;

const createLink =
    <T extends Narrow<Route[]>>(_routes: T) =>
    <
        Path extends ExtractPaths<T>,
        QS extends HasQueryString<Path> extends true ? QueryString<Path> : UrlParams<ExtractPathname<Path>>,
        Params extends UrlParams<ExtractPathname<Path>> extends null ? null : UrlParams<ExtractPathname<Path>>
    >(
        ...args: Params extends null ? [path: Path, qs: QS] : [path: Path, params: Params, qs: QS]
    ): string =>
        mergeUrlEntities(args[0], args[1], args[2]);

const createUsePaths =
    <T extends Narrow<Route[]>>(_routes: T) =>
    <Path extends ExtractPaths<T>>(_path: Path): UrlParams<ExtractPathname<Path>> =>
        useRouter().params;


const createUseQueryString = <T extends Narrow<Route[]>>(_routes: T) => {
    return <Path extends ExtractPaths<T>>(_path: Path): QueryString<Path> => {
        const { href, page } = useRouter();
        const urlSearchParams = useUrlSearchParams();
        return useMemo(
            () => (page === null ? ({} as any) : transformData(urlSearchParams, remapQueryStringParams(_path))),
            [href, page, urlSearchParams]
        );
    };
};

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
            const pathReplace = path.replace(/:\w+/, (t) => `(?<${t.replace(/^:/g, "")}>[^/:]+)`);
            const regex = new RegExp(`^${pathReplace}$`);
            return {
                path,
                regex,
                id: x.id,
                element: x.element,
                originalPath: x.path,
            };
        });

const history = createBrowserHistory();

export const createRouter = <T extends readonly Route[]>(routes: Narrow<Readonly<T>>, basename: string = "/") => ({
    navigation: {
        back: () => history.back(),
        forward: () => history.forward(),
        go: (jumps: number) => history.go(jumps),
        push: (path: string) => history.push(applyBasename(basename, path)),
        replace: (path: string) => history.replace(applyBasename(basename, path)),
    },
    link: createLink(routes as Route[]),
    usePaths: createUsePaths(routes as Route[]),
    useQueryString: createUseQueryString(routes as Route[]),
    config: { routes: configureRoutes(routes as Route[]), history, basename } as const,
    links: (routes as Route[]).reduce((acc, el) => ({ ...acc, [el.id]: el.path }), {} as Links<T>),
});
