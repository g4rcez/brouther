import type { Actions, AsRouter, ConfiguredRoute, CreateMappedRoute, FetchPaths, Loader, PathFormat, Route, RouteData, Router } from "../types";
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
    <T extends Route<PathFormat, RouteData, string>[]>(_routes: T) =>
    <Path extends FetchPaths<T>>(_path: Path): Paths.Variables<Paths.Pathname<Path>> =>
        useRouter().paths;

const createUseQueryString =
    <const T extends Route<PathFormat, RouteData, string>[]>(_routes: T) =>
    <Path extends FetchPaths<T>>(_path: Path): QueryString.Parse<Path> => {
        const { href, page } = useRouter();
        const urlSearchParams = useUrlSearchParams();
        return useMemo(
            () => (page === null ? ({} as any) : transformData(urlSearchParams, mapUrlToQueryStringRecord(_path, fromStringToValue))),
            [href, page, urlSearchParams]
        );
    };

const configureRoutes = (arr: Route<PathFormat, RouteData, string>[], basename: string): ConfiguredRoute[] =>
    rankRoutes(arr).map((x) => {
        const u = urlEntity(x.path);
        const path = join(basename, trailingOptionalPath(u.pathname)) as PathFormat;
        const pathReplace = path.replace(/:\w+/, (t) => `(?<${t.replace(/^:/g, "")}>[^/:]+)`);
        const regex = new RegExp(`^${pathReplace}$`);
        return { ...x, path, regex, originalPath: x.path };
    });

export const createRoute = <
    const Path extends PathFormat,
    const Args extends {
        id?: string;
        element: React.ReactElement;
        loader?: Route<Path, Data>["loader"];
        actions?: Route<Path, Data>["actions"];
    },
    Data extends RouteData
>(
    path: Path,
    args: Args,
    data?: Data
): Route<Path, Data, NonNullable<Args["id"]>> => ({ ...args, id: args.id ?? path, data, path: path as never });

export const createRouter = <const T extends Function.Narrow<readonly Route[]>, const Basename extends string>(
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
        links: (routes as Route[]).reduce(
            (acc, el) => ({
                ...acc,
                [el.id]: el.path,
            }),
            {}
        ) as any,
    };
};

export const createMappedRouter = <const T extends Function.Narrow<Router>, Basename extends string>(
    routes: T,
    basename: Basename = "/" as any
): CreateMappedRoute<T> => {
    const list = Object.keys(routes).map((id) => {
        const r = routes[id];
        const data = r.data ?? {};
        return createRoute(
            r.path,
            {
                id,
                loader: r.loader as Loader,
                actions: r.actions as Actions,
                element: r.element as React.ReactElement,
            },
            data
        );
    });
    return createRouter(list as any, basename) as any;
};

export const asyncLoader =
    <Path extends PathFormat, Data extends RouteData = RouteData>(
        func: () => Promise<{
            default: any;
            loader: Route<Path, Data>["loader"];
        }>
    ): Route<Path, any>["loader"] =>
    async (args: any) => {
        const r = await func();
        return r.loader!(args);
    };

export const asyncActions =
    <const Path extends PathFormat, Data extends RouteData = RouteData>(
        func: () => Promise<{
            default: any;
            actions?: Route<Path, Data, string>["actions"];
        }>
    ): Route<Path, Data, string>["actions"] =>
    async () => {
        const r = await func();
        return r.actions!();
    };

export const asyncComponent = (
    func: () => Promise<{
        default: React.ComponentType<any>;
    }>
) => React.createElement(React.lazy(func));
