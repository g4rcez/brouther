import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ConfiguredRoute, Nullable } from "./types";
import { createBrowserHistory } from "history";
import { BroutherError, NotFoundRoute } from "./errors";
import { createHref, transformData, urlEntity } from "./utils";
import { RouterNavigator } from "./router-navigator";

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

/*
    Brouther context to configure all routing ecosystem
 */
export const Brouther = ({
    config,
    children,
}: React.PropsWithChildren<{
    config: {
        basename: string;
        routes: ConfiguredRoute[];
        history: History;
    };
}>) => {
    const [location, setLocation] = useState(() => config.history.location);
    const pathName = location.pathname;
    const matches = useMemo(() => {
        const page = findRoute(pathName, config.routes);
        const params = page?.regex.exec(pathName)?.groups ?? {};
        const error = page === null ? new NotFoundRoute(pathName) : null;
        return { page, error, params };
    }, [config.routes, pathName]);

    useEffect(() => config.history.listen((changes) => setLocation(changes.location)), [config.history]);

    const href = createHref(pathName, location.search, location.hash, config.basename);
    const navigation = useMemo(() => new RouterNavigator(config.history), [config.history, config.history]);

    const value: ContextProps = {
        href,
        navigation,
        location,
        page: matches.page,
        error: matches.error,
        paths: matches.params,
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
    return ctx?.error as Nullable<T>;
};

/*
    The representation of the query-string as [URLSearchParams](https://developer.mozilla.org/en-us/docs/web/api/urlsearchparams)
*/
export const useUrlSearchParams = () => {
    const { href } = useRouter();
    return urlEntity(href).searchParams;
};

/*
    All dynamic paths in the url, represented by /users/:id, for example
 */
export const usePaths = <T extends {}>(): T => useRouter().paths as any;

/*
    The representation of the query-string, but as a simple plain javascript object
 */

export const useQueryString = <T extends {}>(): T => {
    const { href, page } = useRouter();
    const urlSearchParams = useUrlSearchParams();
    return useMemo(() => (page === null ? ({} as any) : transformData(urlSearchParams)), [href, page, urlSearchParams]);
};

/*
    All methods to manipulate the history stack, an instance of RouterNavigator
    - go: go to N in the stack
    - back: go back in the stack
    - forward: go forward in the stack, if is possible
    - push: push the url to the stack and go to the path
    - replace: the same of push, but replace the current item in the stack
 */

export const useNavigation = () => useRouter().navigation;
