import { createBrowserHistory } from "history";
import React, { useMemo } from "react";
import type { Function } from "ts-toolbelt";
import { useBrouther, useUrlSearchParams } from "../brouther/brouther";
import type { Actions, AsRouter, CreateMappedRoute, FetchPaths, Loader, Options, PathFormat, Route, RouteData, Router } from "../types";
import { BrowserHistory } from "../types/history";
import type { Paths } from "../types/paths";
import type { QueryString } from "../types/query-string";
import { fromStringToValue, parsePath } from "../utils/mappers";
import { createLink, mapUrlToQueryStringRecord, rankRoutes, transformData } from "../utils/utils";
import { RouterNavigator } from "./router-navigator";

const createUsePaths =
    <T extends Route[]>(_routes: T) =>
    <Path extends FetchPaths<T>>(_path: Path): Paths.Parse<Paths.Pathname<Path>> =>
        useBrouther().paths as any;

const createUseQueryString =
    <const T extends Route[]>(_routes: T) =>
    <Path extends FetchPaths<T>>(_path: Path): QueryString.Parse<Path> => {
        const { href, page } = useBrouther();
        const urlSearchParams = useUrlSearchParams();
        return useMemo(
            () => (page === null ? ({} as any) : transformData(urlSearchParams, mapUrlToQueryStringRecord(_path, fromStringToValue))),
            [href, page, urlSearchParams]
        );
    };

type ConfigureRoute = {
    readonly actions?: Actions;
    readonly data?: RouteData;
    readonly element: React.ReactElement;
    readonly id: string;
    readonly loader?: Loader;
    readonly originalPath: PathFormat;
    readonly path: PathFormat;
    readonly regex: RegExp;
};

const configureRoutes = (arr: Route[], basename: string, sensitiveCase: boolean): ConfigureRoute[] =>
    rankRoutes(arr).map((x) => ({
        ...x,
        ...parsePath({ path: x.path, basename, sensitiveCase }),
        originalPath: x.path,
    }));

export const createRoute = <
    const Path extends PathFormat,
    const Args extends {
        actions?: Route<Path, Data>["actions"];
        element: React.ReactElement;
        errorElement?: Route<Path, Data>["element"];
        id?: string;
        loader?: Route<Path, Data>["loader"];
    },
    const Data extends RouteData,
>(
    path: Path,
    args: Args,
    data?: Data
): Route<Path, Data, NonNullable<Args["id"]>> => ({
    ...args,
    id: args.id ?? path,
    data,
    path: path as never,
    errorElement: args.errorElement,
});

const createRouter = <const T extends Function.Narrow<readonly Readonly<Route>[]>, const Basename extends string, R extends Function.Narrow<Router>>(
    routes: Function.Narrow<Readonly<T>>,
    basename: Basename = "/" as Basename,
    router: R,
    options: Options | (() => BrowserHistory) = createBrowserHistory
): CreateMappedRoute<AsRouter<T>> => {
    const opts: Required<Options> =
        typeof options === "function"
            ? { history: options, sensitiveCase: true }
            : {
                  history: options.history ?? createBrowserHistory,
                  sensitiveCase: options.sensitiveCase ?? true,
              };
    const fn = opts.history;
    const history = fn();
    const link = createLink(routes as Route[]);
    const navigation = new RouterNavigator(history);
    const routesConfig = configureRoutes(routes as any, basename, opts.sensitiveCase);
    const links = (routes as Route[]).reduce((acc, el) => ({ ...acc, [el.id]: el.path }), {} as any);
    return {
        link,
        links,
        navigation,
        usePaths: createUsePaths(routes as Route[]) as any,
        useQueryString: createUseQueryString(routes as Route[]) as any,
        config: { routes: routesConfig, history, navigation, basename, links, link, router, options: opts } as any,
    };
};

export const createMappedRouter = <const T extends Function.Narrow<Router>, Basename extends string>(
    routes: T,
    basename: Basename = "/" as Basename,
    options?: Options
): CreateMappedRoute<T> => {
    const list = Object.keys(routes).map((id) => {
        const r = routes[id];
        return createRoute(
            r.path,
            {
                id,
                loader: r.loader as Loader,
                actions: r.actions as Actions,
                errorElement: r.errorElement as any,
                element: r.element as React.ReactElement,
            },
            r.data ?? {}
        );
    });
    return createRouter(list as any, basename, routes, options) as any;
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
