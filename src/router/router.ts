import type { AsRouter, ConfiguredRoute, CreateMappedRoute, FetchPaths, PathFormat, Route, RouteData, Router } from "../types";
import { createLink, join, mapUrlToQueryStringRecord, rankRoutes, trailingOptionalPath, transformData, urlEntity } from "../utils/utils";
import { useRouter, useUrlSearchParams } from "../brouther/brouther";
import { createBrowserHistory } from "history";
import React, { useMemo } from "react";
import type { Function } from "ts-toolbelt";
import { fromStringToValue } from "../utils/mappers";
import { RouterNavigator } from "./router-navigator";
import type { Paths } from "../types/paths";
import type { QueryString } from "../types/query-string";
import type { BrowserHistory } from "../types/history";

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
        const path = join(basename, trailingOptionalPath(u.pathname)) as PathFormat;
        const pathReplace = path.replace(/:\w+/, (t) => `(?<${t.replace(/^:/g, "")}>[^/:]+)`);
        const regex = new RegExp(`^${pathReplace}$`);
        return { ...x, path, regex, originalPath: x.path };
    });

export const createRoute = <
    Path extends PathFormat,
    Data extends RouteData,
    Loader extends Route<Data, Path>["loader"],
    Actions extends Route<Data, Path>["actions"],
    ID extends string | undefined
>(
    path: Path,
    args: {
        id?: ID;
        element: React.ReactElement;
        loader?: Loader;
        actions?: Actions;
    },
    data?: Data
): Route<Data, Path> => ({ ...args, id: args.id ?? path, data, path: path as never });

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

export const createMappedRouter = <T extends Readonly<Router>, Basename extends string>(
    routes: T,
    basename: Basename = "/" as any
): CreateMappedRoute<T> => {
    const list = Object.keys(routes).map((id) => {
        const r = routes[id];
        const data = r.data ?? {};
        return createRoute(r.path, { id, element: r.element, actions: r.actions, loader: r.loader }, data);
    });
    return createRouter(list, basename) as any;
};

export const asyncLoader =
    (func: () => Promise<{ default: any; loader: Route["loader"] }>): Route["loader"] =>
    async (args: any) => {
        const r = await func();
        return r.loader!(args);
    };

export const asyncActions =
    (func: () => Promise<{ default: any; actions?: Route["actions"] }>): Route["actions"] =>
    async () => {
        const r = await func();
        return r.actions!();
    };
