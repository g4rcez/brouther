import React, { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ConfiguredRoute } from "../types";
import { BroutherError, NotFoundRoute } from "../utils/errors";
import { createHref, mapUrlToQueryStringRecord, transformData, urlEntity } from "../utils/utils";
import { RouterNavigator } from "../router/router-navigator";
import { fromStringToValue } from "../utils/mappers";
import type { QueryString } from "../types/query-string";
import type { Paths } from "../types/paths";
import { BrowserHistory } from "../types/history";
import { X } from "../types/x";

export type ContextProps = {
    href: string;
    basename: string;
    navigation: RouterNavigator;
    paths: Record<string, string>;
    loaderData: X.Nullable<unknown>;
    error: X.Nullable<BroutherError>;
    page: X.Nullable<ConfiguredRoute>;
    location: BrowserHistory["location"];
    setLoaderData: Dispatch<SetStateAction<X.Nullable<unknown>>>;
};

const Context = createContext<ContextProps | undefined>(undefined);

const findRoute = (path: string, routes: ConfiguredRoute[]): X.Nullable<ConfiguredRoute> => routes.find((x) => x.regex.test(path)) ?? null;

type Base = { basename: string; history: BrowserHistory; routes: ConfiguredRoute[]; navigation: RouterNavigator };

export type BroutherProps<T extends Base> = React.PropsWithChildren<{
    config: Base;
    filter?: (route: T["routes"][number], config: T) => boolean;
}>;

/*
    Brouther context to configure all routing ecosystem
 */
export const Brouther = <T extends Base>({ config, children, filter }: BroutherProps<T>) => {
    const [location, setLocation] = useState(() => config.history.location);
    const [loaderData, setLoaderData] = useState<X.Nullable<unknown>>(null);
    const pathName = location.pathname;

    const findMatches = useCallback(() => {
        const r = filter ? config.routes.filter((route) => filter(route, config as any)) : config.routes;
        const page = findRoute(pathName, r as any);
        const existPage = page !== null;
        const params = existPage ? page.regex.exec(pathName)?.groups ?? {} : {};
        return existPage ? { page, error: null, params } : { page: null, error: new NotFoundRoute(pathName), params };
    }, [config.routes, pathName, filter]);
    const [matches, setMatches] = useState(findMatches);

    const basename = config.basename;
    const href = createHref(pathName, location.search, location.hash, basename);

    useEffect(() => {
        const result = findMatches();
        const request = async () => {
            if (result?.page?.loader) {
                const search = new URLSearchParams(location.search);
                const qs = transformData(search, mapUrlToQueryStringRecord(result.page.originalPath, fromStringToValue));
                const state = (location.state as any) ?? {};
                const r = await result.page.loader({
                    path: href,
                    queryString: qs,
                    paths: result.params ?? {},
                    data: result.page.data ?? {},
                    request: new Request(state.url ?? href, { body: state.body ?? undefined, headers: state.headers }),
                });
                setLoaderData(r);
            }
        };
        request();
        setMatches(result);
    }, [findMatches, location.search, location.state]);

    useEffect(() => config.history.listen((changes: any) => setLocation({ ...changes.location })), [config.history]);

    const value: ContextProps = {
        href,
        loaderData,
        basename,
        location,
        setLoaderData,
        page: matches.page,
        error: matches.error,
        paths: matches.params,
        navigation: config.navigation,
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

/*
    All dynamic paths in the url, represented by /users/:id, for example
 */
export const usePaths = <T extends {} | string>(_?: T): T extends string ? Paths.Variables<Paths.Pathname<T>> : T => useRouter().paths as any;

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

export const useLoader = <T extends unknown>(): X.Nullable<T> => useRouter().loaderData as never;

export const useDataLoader = <T extends unknown>() => {
    const data = useLoader();
    const convertData = useCallback(async () => {
        if (data === null) return null;
        if (!(data instanceof Response)) return null;
        return data.json();
    }, [data]);

    const [state, setState] = useState(null);

    useEffect(() => {
        convertData().then(setState);
    }, [data]);
    return state;
};
