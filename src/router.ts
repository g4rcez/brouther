import type { AsRouter, ConfiguredRoute, CreateMappedRoute, FetchPaths, Pathname, QueryString, Route, Router, UrlParams } from "./types";
import { createLink, mapUrlToQueryStringRecord, trailingOptionalPath, transformData, urlEntity } from "./utils";
import { useRouter, useUrlSearchParams } from "./brouther";
import { createBrowserHistory } from "history";
import { useMemo } from "react";
import type { Function } from "ts-toolbelt";
import { fromStringToValue } from "./mappers";
import { RouterNavigator } from "./router-navigator";

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
                data: x.data,
                element: x.element,
                originalPath: x.path,
            };
        });

export const createRouter = <T extends readonly Route[], Basename extends string>(
    routes: Function.Narrow<Readonly<T>>,
    basename: Basename = "/" as any
): CreateMappedRoute<AsRouter<T>> => {
    const history = createBrowserHistory();
    const navigation = new RouterNavigator(history);
    return {
        navigation,
        link: createLink(routes as Route[]) as any,
        usePaths: createUsePaths(routes as Route[]) as any,
        useQueryString: createUseQueryString(routes as Route[]) as any,
        config: { routes: configureRoutes(routes as any), history, navigation, basename } as any,
        links: (routes as Route[]).reduce((acc, el) => ({ ...acc, [el.id]: el.path }), {}) as any,
    };
};

export const createMappedRouter = <T extends Function.Narrow<Router>, Basename extends string>(
    routes: T,
    basename: Basename = "/" as any
): CreateMappedRoute<T> =>
    createRouter(
        Object.keys(routes).map((id) => {
            const o = routes[id];
            return { id, path: o.path, data: o.data, element: o.element };
        }),
        basename
    ) as any;
