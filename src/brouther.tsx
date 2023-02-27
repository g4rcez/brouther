import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CommonRoute, ConfiguredRoute, CustomSearchParams, Nullable, Pathname, QueryString, UrlParams } from "./types";
import { createBrowserHistory } from "history";
import { BroutherError, NotFoundRoute } from "./errors";
import { createHref, mapUrlToQueryStringRecord, transformData, urlEntity } from "./utils";
import { RouterNavigator } from "./router-navigator";
import { fromStringToValue } from "./mappers";

type History = ReturnType<typeof createBrowserHistory>;

export type ContextProps = {
    page: Nullable<ConfiguredRoute>;
    error: Nullable<BroutherError>;
    navigation: RouterNavigator;
    location: History["location"];
    paths: Record<string, string>;
    href: string;
};

const Context = createContext<ContextProps | undefined>(undefined);

const findRoute = (path: string, routes: ConfiguredRoute[]): Nullable<ConfiguredRoute> => routes.find((x) => x.regex.test(path)) ?? null;

export type BroutherProps = React.PropsWithChildren<{
    config: CommonRoute["config"];
    filter?: (params: { route: ConfiguredRoute; config: CommonRoute["config"]; pathname: string }) => boolean;
}>;

/*
    Brouther context to configure all routing ecosystem
 */
export const Brouther = ({ config, children, filter }: BroutherProps) => {
    const [location, setLocation] = useState(() => config.history.location);
    const pathName = location.pathname;
    const matches = useMemo(() => {
        const r = filter ? config.routes.filter((route) => filter({ route, config, pathname: pathName })) : config.routes;
        const page = findRoute(pathName, r);
        const existPage = page !== null;
        return existPage
            ? { page, error: null, params: page.regex.exec(pathName)?.groups ?? {} }
            : { page: null, error: new NotFoundRoute(pathName), params: {} };
    }, [config.routes, pathName, filter]);

    useEffect(() => config.history.listen((changes) => setLocation(changes.location)), [config.history]);

    const href = createHref(pathName, location.search, location.hash, config.basename);

    const value: ContextProps = {
        href,
        location,
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
    return (ctx?.error as Nullable<T>) ?? null;
};

/*
    The representation of the query-string as [URLSearchParams](https://developer.mozilla.org/en-us/docs/web/api/urlsearchparams)
*/
export const useUrlSearchParams = <T extends {}>(): CustomSearchParams<T> => {
    const href = useHref();
    return urlEntity(href).searchParams as CustomSearchParams<T>;
};

/*
    All dynamic paths in the url, represented by /users/:id, for example
 */
export const usePaths = <T extends {} | string>(_?: T): T extends string ? UrlParams<Pathname<T>> : T => useRouter().paths as any;

/*
    The representation of the query-string, but as simple plain javascript object
 */

export const useQueryString = <T extends {} | string>(_?: T): T extends string ? QueryString<T> : T => {
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
