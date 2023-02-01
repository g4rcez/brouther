import { Narrow } from "ts-toolbelt/out/Function/Narrow";
import { ConfiguredRoute, CreateHref, CreateLinks, CreateMappedRoute, FetchPaths, Pathname, QueryString, Route, Router, UrlParams } from "./types";
import { applyBasename, mergeUrlEntities, remapQueryStringParams, trailingOptionalPath, transformData, urlEntity } from "./utils";
import { useRouter, useUrlSearchParams } from "./brouther";
import { createBrowserHistory } from "history";
import { useMemo } from "react";
import { RouterNavigator } from "./router-navigator";
import { Merge } from "ts-toolbelt/out/Union/Merge";

const createLink =
    <T extends Narrow<Route[]>>(_routes: T): CreateHref<T> =>
    (...args: any): any =>
        mergeUrlEntities(args[0], args[1], args[2]) as never;

const createUsePaths =
    <T extends Narrow<Route[]>>(_routes: T) =>
    <Path extends FetchPaths<T>>(_path: Path): UrlParams<Pathname<Path>> =>
        useRouter().paths;

const createUseQueryString =
    <T extends Narrow<Route[]>>(_routes: T) =>
    <Path extends FetchPaths<T>>(_path: Path): QueryString<Path> => {
        const { href, page } = useRouter();
        const urlSearchParams = useUrlSearchParams();
        return useMemo(
            () => (page === null ? ({} as any) : transformData(urlSearchParams, remapQueryStringParams(_path))),
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
    links: Merge<CreateLinks<T>>;
    config: { routes: ConfiguredRoute[]; basename: string; history: BrowserHistory };
    useQueryString: <Path extends FetchPaths<Route[]>>(_path: Path) => QueryString<Path>;
    usePaths: <Path extends FetchPaths<Route[]>>(_path: Path) => UrlParams<Pathname<Path>>;
};

export const createRouter = <T extends readonly Route[]>(routes: Narrow<Readonly<T>>, basename: string = "/"): CreateRouter<T> => ({
    navigation: {
        back: () => history.back(),
        forward: () => history.forward(),
        go: (jumps: number) => history.go(jumps),
        push: (path: string) => history.push(applyBasename(basename, path)),
        replace: (path: string) => history.replace(applyBasename(basename, path)),
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

export const createMappedRouter = <T extends Narrow<Router>>(routes: T, basename: string = ""): CreateMappedRoute<T> =>
    createRouter(
        Object.keys(routes).map((x) => ({
            ...(routes as any)[x],
            id: x,
        })),
        basename
    ) as never;
