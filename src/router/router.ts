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
    <T extends Route[]>(_routes: T) =>
    <Path extends FetchPaths<T>>(_path: Path): Paths.Parse<Paths.Pathname<Path>> =>
        useRouter().paths as any;

const createUseQueryString =
    <const T extends Route[]>(_routes: T) =>
    <Path extends FetchPaths<T>>(_path: Path): QueryString.Parse<Path> => {
        const { href, page } = useRouter();
        const urlSearchParams = useUrlSearchParams();
        return useMemo(
            () => (page === null ? ({} as any) : transformData(urlSearchParams, mapUrlToQueryStringRecord(_path, fromStringToValue))),
            [href, page, urlSearchParams]
        );
    };

export const parsePath = ({ path, basename }: { path: string; basename: string }) => {
    const pathname = decodeURIComponent(urlEntity(path).pathname);
    const transformedPath = join(basename, trailingOptionalPath(pathname)) as PathFormat;
    const pathReplace = transformedPath.replace(/(<\w+:(\w+)>|:\w+)/gm, (t) => {
        const token = t.replace("<", "").replace(">", "").replace(":", "___");
        return `(?<${token.replace(/^:/g, "")}>[^/:]+)`;
    });
    return { regex: new RegExp(`^${pathReplace}$`), path: transformedPath };
};

const configureRoutes = (
    arr: Route[],
    basename: string
): {
    path: PathFormat;
    regex: RegExp;
    readonly data?: RouteData;
    readonly loader?: Loader<PathFormat, RouteData>;
    readonly id: string;
    originalPath: PathFormat;
    readonly actions?: Actions<PathFormat, RouteData>;
    readonly element: React.ReactElement;
}[] =>
    rankRoutes(arr).map((x) => ({
        ...x,
        ...parsePath({ path: x.path, basename }),
        originalPath: x.path,
    }));

export const createRoute = <
    const Path extends PathFormat,
    const Args extends {
        id?: string;
        element: React.ReactElement;
        loader?: Route<Path, Data>["loader"];
        actions?: Route<Path, Data>["actions"];
    },
    const Data extends RouteData
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
            actions?: Route<Path, Data>["actions"];
        }>
    ): Route<Path, Data>["actions"] =>
    async () => {
        const r = await func();
        return r.actions!();
    };

export const asyncComponent = (
    func: () => Promise<{
        default: React.ComponentType<any>;
    }>
) => React.createElement(React.lazy(func));
