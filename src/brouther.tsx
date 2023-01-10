import React, { createContext, useContext, useMemo, useRef } from "react";
import { ConfiguredRoute, ExtractPaths, Nullable, QueryString, Route } from "./types";
import { BrowserHistory, createBrowserHistory } from "history";
import { BroutherError, NotFoundRoute } from "./errors";
import { createHref, transformData, urlEntity } from "./utils";
import { Narrow } from "ts-toolbelt/out/Function/Narrow";

export type ContextProps = {
    page: Nullable<ConfiguredRoute>;
    error: Nullable<BroutherError>;
    history: ReturnType<typeof createBrowserHistory>;
    params: Record<string, string>;
    href: string;
};

const Context = createContext<ContextProps | undefined>(undefined);

const findRoute = (path: string, routes: ConfiguredRoute[]): Nullable<ConfiguredRoute> => routes.find((x) => x.regex.test(path)) ?? null;

export const Brouther = ({
    basename = "/",
    routes,
    children,
}: React.PropsWithChildren<{
    basename?: string;
    notFound?: React.ReactElement;
    routes: ConfiguredRoute[];
}>) => {
    const history = useRef(createBrowserHistory());
    const pathName = history.current.location.pathname;
    const matches = useMemo(() => {
        const page = findRoute(pathName, routes);
        const params = page?.regex.exec(pathName)?.groups ?? {};
        const error = page === null ? new NotFoundRoute(pathName) : null;
        return { page, error, params };
    }, [routes, pathName]);

    const href = createHref(pathName, history.current.location.search, history.current.location.hash, basename);

    const value: ContextProps = {
        href,
        history: history.current,
        page: matches.page,
        error: matches.error,
        params: matches.params,
    };
    return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useRouter = (): ContextProps => {
    const ctx = useContext(Context);
    if (ctx === undefined) throw new Error("Context error");
    return ctx;
};
export const usePage = () => useRouter().page?.element ?? null;

export const useErrorPage = <T extends BroutherError>() => {
    const ctx = useContext(Context);
    return ctx?.error as Nullable<T>;
};

export const useHistory = (): BrowserHistory => useRouter().history;

export const useUrlSearchParams = () => {
    const { href } = useRouter();
    return urlEntity(href).searchParams;
};

export const useParams = <T extends {}>(): T => useRouter().params as any;

export const useQueryString = <T extends {}>(): T => {
    const { href, page } = useRouter();
    const urlSearchParams = useUrlSearchParams();
    return useMemo(() => (page === null ? ({} as any) : transformData(page.originalPath, urlSearchParams)), [href, page, urlSearchParams]);
};
