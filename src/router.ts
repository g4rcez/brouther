import { ConfiguredRoute, CreateHref, CreateLinks, CreateMappedRoute, FetchPaths, Pathname, QueryString, Route, Router, UrlParams } from "./types";
import {
    setBasename,
    mergeUrlEntities,
    remapQueryStringParams,
    trailingOptionalPath,
    transformData,
    urlEntity,
    mapUrlToQueryStringRecord,
} from "./utils";
import { useRouter, useUrlSearchParams } from "./brouther";
import { createBrowserHistory } from "history";
import { useMemo } from "react";
import { RouterNavigator } from "./router-navigator";
import { Union, Function } from "ts-toolbelt";
import { fromStringToValue } from "./mappers";

const createLink =
    <T extends Function.Narrow<Route[]>>(_routes: T): CreateHref<T> =>
    (...args: any): any =>
        mergeUrlEntities(args[0], args[1], args[2]) as never;

const createUsePaths =
    <T extends Function.Narrow<Route[]>>(_routes: T) =>
    <Path extends FetchPaths<T>>(_path: Path): UrlParams<Pathname<Path>> =>
        useRouter().paths;

const createUseQueryString =
    <T extends Function.Narrow<Route[]>>(_routes: T) =>
    <Path extends FetchPaths<T>>(_path: Path): QueryString<Path> => {
        const { href, page } = useRouter();
        const urlSearchParams = useUrlSearchParams();
        return useMemo(
            () => (page === null ? ({} as any) : transformData(urlSearchParams, mapUrlToQueryStringRecord(_path, fromStringToValue))),
            [href, page, urlSearchParams]
        );
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

type BrowserHistory = typeof history;

type CreateRouter<T extends readonly Route[]> = {
    link: CreateHref<Route[]>;
    navigation: RouterNavigator;
    links: Union.Merge<CreateLinks<T>>;
    config: { routes: ConfiguredRoute[]; basename: string; history: BrowserHistory };
    useQueryString: <Path extends FetchPaths<Route[]>>(_path: Path) => QueryString<Path>;
    usePaths: <Path extends FetchPaths<Route[]>>(_path: Path) => UrlParams<Pathname<Path>>;
};

export const createRouter = <T extends readonly Route[]>(routes: Function.Narrow<Readonly<T>>, basename: string = "/"): CreateRouter<T> => ({
    navigation: {
        back: () => history.back(),
        forward: () => history.forward(),
        go: (jumps: number) => history.go(jumps),
        push: (path: string) => history.push(setBasename(basename, path)),
        replace: (path: string) => history.replace(setBasename(basename, path)),
    },
    link: createLink(routes as Route[]) as any,
    usePaths: createUsePaths(routes as Route[]) as any,
    useQueryString: createUseQueryString(routes as Route[]) as any,
    config: { routes: configureRoutes(routes as Route[]), history, basename } as any,
    links: (routes as Route[]).reduce(
        (acc, el) => ({
            ...acc,
            [el.id]: el.path,
        }),
        {}
    ) as never,
});

export const createMappedRouter = <T extends Function.Narrow<Router>>(routes: T, basename: string = ""): CreateMappedRoute<T> =>
    createRouter(
        Object.keys(routes).map((x) => ({ ...routes[x], id: x })),
        basename
    ) as never;
