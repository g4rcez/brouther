import type { AsRouter, ConfiguredRoute, CreateMappedRoute, FetchPaths, HttpMethods, Loader, Route, RouteData, Router, UrlFormat } from "./types";
import { createLink, join, mapUrlToQueryStringRecord, rankRoutes, trailingOptionalPath, transformData, urlEntity } from "./utils";
import { useRouter, useUrlSearchParams } from "./brouther";
import { createBrowserHistory } from "history";
import React, { useMemo } from "react";
import type { Function } from "ts-toolbelt";
import { fromStringToValue } from "./mappers";
import { RouterNavigator } from "./router-navigator";
import type { Paths } from "./types/paths";
import type { QueryString } from "./types/query-string";
import { BrowserHistory } from "./types/history";

const createUsePaths =
    <T extends Function.Narrow<Route[]>>(_routes: T) =>
    <Path extends FetchPaths<T>>(_path: Path): Paths.Variables<Paths.Pathname<Path>> =>
        useRouter().paths;

const createUseQueryString =
    <T extends Function.Narrow<Route[]>>(_routes: T) =>
    <Path extends FetchPaths<T>>(_path: Path): QueryString.Parse<Path> => {
        const { href, page } = useRouter();
        const urlSearchParams = useUrlSearchParams();
        return useMemo(
            () => (page === null ? ({} as any) : transformData(urlSearchParams, mapUrlToQueryStringRecord(_path, fromStringToValue))),
            [href, page, urlSearchParams]
        );
    };

const configureRoutes = (arr: Route[], basename: string): ConfiguredRoute[] =>
    rankRoutes(arr).map((x) => {
        const u = urlEntity(x.path);
        const path = join(basename, trailingOptionalPath(u.pathname)) as UrlFormat;
        const pathReplace = path.replace(/:\w+/, (t) => `(?<${t.replace(/^:/g, "")}>[^/:]+)`);
        const regex = new RegExp(`^${pathReplace}$`);
        return { ...x, path, regex, originalPath: x.path };
    });

export function createRoute<ID extends string, Path extends UrlFormat, Data extends RouteData>(
    id: ID,
    path: Path,
    element: React.ReactElement,
    args?: Partial<{
        data: Data;
        loader: Route<Data, Path>["loader"];
        actions: Route<Data, Path>["actions"];
    }>
): Route;

export function createRoute<Path extends UrlFormat, Data extends RouteData>(
    path: Path,
    element: JSX.Element,
    args?: Partial<{
        data: Data;
        loader: Loader<Path, Data>;
        actions: Partial<Record<HttpMethods, Loader<Path, Data>>>;
    }>
): Route;

export function createRoute<ID extends string, Path extends UrlFormat, Data extends RouteData>(...args: any[]): Route {
    if (args.length === 4) {
        const [id, path, element, fns] = args;
        return { id, path, element, loader: fns?.loader as never, actions: fns?.actions as never };
    }
    const [path, element, fns] = args;
    return { id: path, path, data: fns.data, element, loader: fns?.loader as never, actions: fns?.actions as never };
}

export const createRouter = <T extends readonly Route[], Basename extends string>(
    routes: Function.Narrow<Readonly<T>>,
    basename: Basename = "/" as any,
    historyCreate?: () => BrowserHistory
): CreateMappedRoute<AsRouter<T>> => {
    const fn = historyCreate ?? createBrowserHistory;
    const history = fn();
    const navigation = new RouterNavigator(history);
    return {
        navigation,
        link: createLink(routes as Route[]) as any,
        usePaths: createUsePaths(routes as Route[]) as any,
        useQueryString: createUseQueryString(routes as Route[]) as any,
        config: { routes: configureRoutes(routes as any, basename), history, navigation, basename } as any,
        links: (routes as Route[]).reduce((acc, el) => ({ ...acc, [el.id]: el.path }), {}) as any,
    };
};

export const createMappedRouter = <T extends Router, Basename extends string>(routes: T, basename: Basename = "/" as any): CreateMappedRoute<T> => {
    const list = Object.keys(routes).map((id) => {
        const r = routes[id];
        return createRoute(id, r.path, r.element as React.ReactElement, {
            actions: r.actions,
            loader: r.loader,
            data: r.data,
        });
    });
    return createRouter(list, basename) as any;
};
