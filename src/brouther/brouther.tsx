import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ConfiguredRoute, Location, PathFormat } from "../types";
import { BroutherError, NotFoundRoute, UncaughtDataLoader } from "../utils/errors";
import { createHref, has, mapUrlToQueryStringRecord, transformData, urlEntity } from "../utils/utils";
import { RouterNavigator } from "../router/router-navigator";
import { fromStringToValue, pathsToValue } from "../utils/mappers";
import type { QueryString } from "../types/query-string";
import type { Paths } from "../types/paths";
import { BrowserHistory } from "../types/history";
import { X } from "../types/x";
import { InferLoader } from "./brouther-response";

export type ContextProps = {
    basename: string;
    error: X.Nullable<BroutherError>;
    href: string;
    loaderData: X.Nullable<Response>;
    loading: boolean;
    location: Location;
    navigation: RouterNavigator;
    page: X.Nullable<ConfiguredRoute>;
    paths: {};
};

const Context = createContext<ContextProps | undefined>(undefined);

const findRoute = (path: string, routes: ConfiguredRoute[]): X.Nullable<ConfiguredRoute> => routes.find((x) => x.regex.test(path)) ?? null;

type Base = { basename: string; history: BrowserHistory; routes: ConfiguredRoute[]; navigation: RouterNavigator };

export type BroutherProps<T extends Base> = React.PropsWithChildren<{
    config: Base;
    filter?: (route: T["routes"][number], config: T) => boolean;
}>;

export const transformParams = (params: {}) =>
    Object.keys(params).reduce((acc, el) => {
        const [opt, transform] = el.split("___");
        const key = opt || transform;
        const val = (params as any)[el];
        if (transform === undefined) return { ...acc, [key]: val };
        const t = transform.toLowerCase();
        const mapper = has(pathsToValue, t);
        return mapper ? { ...acc, [key]: pathsToValue[t](val) } : { ...acc, [key]: (params as any)[el] };
    }, {});

const findMatches = (config: Base, pathName: string, filter: BroutherProps<any>["filter"]) => {
    const r = filter ? config.routes.filter((route) => filter(route, config)) : config.routes;
    const page = findRoute(pathName, r);
    const existPage = page !== null;
    const params = existPage ? transformParams(page.regex.exec(pathName)?.groups ?? {}) : {};
    return existPage ? { page, error: null, params } : { page: null, error: new NotFoundRoute(pathName), params };
};

/*
    Brouther context to configure all routing ecosystem
 */
export const Brouther = <T extends Base>({ config, children, filter }: BroutherProps<T>) => {
    const [state, setState] = useState(() => ({
        loading: false,
        location: config.history.location,
        loaderData: null as X.Nullable<Response>,
        matches: findMatches(config, config.history.location.pathname, filter),
    }));

    useEffect(() => {
        const result = findMatches(config, state.location.pathname, filter);
        const request = async () => {
            if (result?.page?.loader) {
                setState((p) => ({ ...p, loading: true }));
                const search = new URLSearchParams(state.location.search);
                const qs = transformData(search, mapUrlToQueryStringRecord(result.page.originalPath, fromStringToValue));
                const s = (state.location.state as any) ?? {};
                const r = await result.page.loader({
                    queryString: qs,
                    path: href as PathFormat,
                    paths: result.params ?? {},
                    data: result.page.data ?? {},
                    request: new Request(s.url ?? href, { body: s.body ?? undefined, headers: s.headers }),
                });
                setState((p) => ({ ...p, loaderData: r, loading: false }));
            }
        };
        request().then(() => setState((p) => ({ ...p, matches: result })));
    }, [findMatches, state.location.search, state.location.state, config, filter, state.location.pathname]);

    useEffect(
        () =>
            config.history.listen((changes) =>
                setState((p) => ({
                    ...p,
                    location: { ...changes.location },
                }))
            ),
        [config.history]
    );

    const href = createHref(state.location.pathname, state.location.search, state.location.hash, config.basename);

    const value: ContextProps = {
        basename: config.basename,
        error: state.matches.error,
        href,
        loaderData: state.loaderData,
        loading: state.loading,
        location: state.location,
        navigation: config.navigation,
        page: state.matches.page,
        paths: state.matches.params,
    };

    return <Context.Provider value={value}>{children}</Context.Provider>;
};

/*
    @private
*/
export const useRouter = (): ContextProps => {
    const ctx = useContext(Context);
    if (ctx === undefined) throw new Error("Context error");
    return ctx;
};

/*
    The current url with pathname, query-string and hash
    @returns string
*/
export const useHref = () => useRouter().href;

/*
    The element that matches with the current URL
*/
export const usePage = () => useRouter().page?.element ?? null;

/*
    Instance of any occurred error in brouther
*/
export const useErrorPage = <T extends BroutherError>() => {
    const ctx = useContext(Context);
    return (ctx?.error as X.Nullable<T>) ?? null;
};

/*
    The representation of the query-string as [URLSearchParams](https://developer.mozilla.org/en-us/docs/web/api/urlsearchparams)
*/
export const useUrlSearchParams = <T extends {}>(): QueryString.SearchParams<T> => {
    const href = useHref();
    return urlEntity(href).searchParams as QueryString.SearchParams<T>;
};

type UsePaths = <T extends string>(t?: T) => Paths.Parse<T>;

/*
    All dynamic paths in the url, represented by /users/:id, for example
 */
export const usePaths: UsePaths = <T extends string>(_path?: T): Paths.Parse<T> => useRouter().paths! as any;

/*
    The representation of the query-string, but as simple plain javascript object
 */
export const useQueryString = <T extends {} | string>(_?: T): T extends string ? QueryString.Parse<T> : T => {
    const { href, page } = useRouter();
    const urlSearchParams = useUrlSearchParams();
    return useMemo(
        () => (page === null ? ({} as any) : transformData(urlSearchParams, mapUrlToQueryStringRecord(page.originalPath, fromStringToValue))),
        [href, page, urlSearchParams]
    );
};

/*
    All methods to manipulate the history stack, an instance of RouterNavigator
    - go: go to N in the stack
    - back: go back in the stack
    - forward: go forward in the stack, if is possible
    - push: push the url to the stack and go to the path
    - replace: the same of push, but replace the current item in the stack
 */
export const useNavigation = (): RouterNavigator => useRouter().navigation;

/*
    Get current basename
    @returns string
 */
export const useBasename = (): string => useRouter().basename;

const useLoader = <T extends unknown>(): X.Nullable<T> => useRouter().loaderData as never;

const defaultLoaderParser = (r: Response) => r.clone().json();

type DataLoader = (a: Response) => any;

type Fn = (...a:any[]) => any

export function useDataLoader<T extends DataLoader>(fn: T): ReturnType<T> | null;
export function useDataLoader<T extends Fn>(): Awaited<InferLoader<T>> | null;
export function useDataLoader<T extends DataLoader>(fn: (response: Response) => Promise<ReturnType<T>> = defaultLoaderParser) {
    const data = useLoader();
    const [state, setState] = useState(null);
    useEffect(() => {
        const async = async () => (data instanceof Response ? (fn !== undefined ? fn(data) : null) : null);
        async()
            .then(setState)
            .catch((error) => {
                throw new UncaughtDataLoader(error);
            });
    }, [data]);
    return state;
}
