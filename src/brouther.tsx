import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ConfiguredRoute, Nullable } from "./types";
import { createBrowserHistory } from "history";
import { BroutherError, NotFoundRoute } from "./errors";
import { createHref, transformData, urlEntity } from "./utils";

type History = ReturnType<typeof createBrowserHistory>;

type Navigation = {
    go: History["go"];
    back: History["back"];
    forward: History["forward"];
    push: History["push"];
    replace: History["replace"];
};

export type ContextProps = {
    page: Nullable<ConfiguredRoute>;
    error: Nullable<BroutherError>;
    navigation: Navigation;
    location: History["location"];
    params: Record<string, string>;
    href: string;
};

const Context = createContext<ContextProps | undefined>(undefined);

const findRoute = (path: string, routes: ConfiguredRoute[]): Nullable<ConfiguredRoute> => routes.find((x) => x.regex.test(path)) ?? null;

export const Brouther = ({
    basename = "/",
    config,
    children,
}: React.PropsWithChildren<{
    basename?: string;
    config: {
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

    useEffect(() => {
        config.history.listen((changes) => setLocation(changes.location));
    }, [config.history]);

    const href = createHref(pathName, location.search, location.hash, basename);
    const navigation = useMemo(() => {
        const h = config.history;
        return {
            go: h.go,
            back: h.back,
            forward: h.forward,
            push: h.push,
            replace: h.replace,
        };
    }, [config.history]);

    const value: ContextProps = {
        href,
        navigation,
        location,
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

export const useHref = () => useRouter().href;

export const usePage = () => useRouter().page?.element ?? null;

export const useErrorPage = <T extends BroutherError>() => {
    const ctx = useContext(Context);
    return ctx?.error as Nullable<T>;
};

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

export const useNavigation = () => useRouter().navigation;
