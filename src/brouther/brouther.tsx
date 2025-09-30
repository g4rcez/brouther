import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Base, Context, ContextState } from "../context";
import type { BroutherFlags, PathFormat } from "../types";
import { X } from "../types/x";
import { BroutherError, NotFoundRoute, UnmountTimeout } from "../utils/errors";
import { fromStringToValue, transformParams } from "../utils/mappers";
import { createHref, mapUrlToQueryStringRecord, trailingPath, transformData, urlEntity } from "../utils/utils";
import { CustomResponse } from "./brouther-response";
import { CatchError, usePrevious } from "./catch-error";
import { RouteEvents } from "./route-events";

export type BroutherProps<T extends Base> = React.PropsWithChildren<{
    config: Base;
    cacheSize?: number;
    flags?: BroutherFlags;
    ErrorElement?: React.ReactElement;
    filter?: (route: T["routes"][number], config: T) => boolean;
}>;

const findMatches = (config: Base, pathName: string, filter: BroutherProps<any>["filter"]): ContextState["matches"] => {
    const r = filter ? config.routes.filter((route) => filter(route, config)) : config.routes;
    const route = trailingPath(pathName) || "/";
    const page = r.find((x) => x.regex.test(route)) ?? null;
    const existPage = page !== null;
    const params = existPage ? transformParams(page.regex.exec(route)?.groups ?? {}) : {};
    return existPage ? { params, error: null, page } : { page: null, error: new NotFoundRoute(route), params };
};

/*
    Brouther context to configure all routing ecosystem
 */
export const Brouther = <T extends Base>({
    config,
    cacheSize = 5,
    flags,
    ErrorElement,
    children,
    filter,
}: BroutherProps<T>) => {
    const cache = useRef(new Map<string, CustomResponse<any>>()).current;
    const controller = useRef(new AbortController());

    const [state, setState] = useState<ContextState>(() => {
        const loc = config.history.location;
        const u = createHref(loc.pathname, loc.search, loc.hash, config.basename);
        const matches = findMatches(config, loc.pathname, filter);
        if (matches.page === null) RouteEvents.notFound(u);
        else RouteEvents.change(u);
        const result: ContextState = {
            matches,
            cache: null,
            loading: false,
            firstLoading: true,
            location: loc,
            error: null as X.Nullable<BroutherError>,
            loaderData: null as X.Nullable<Response>,
            actions: { state: "idle", loading: false },
            loadingElement: matches.page?.loadingElement,
            loaderDataPromise: null as any,
        };
        if (matches.page?.loader) {
            const search = new URLSearchParams(loc.search);
            const qs = transformData(search, mapUrlToQueryStringRecord(matches.page.originalPath, fromStringToValue));
            const prevPath = createHref(loc.pathname, loc.search, loc.hash, config.basename);
            result.loaderDataPromise = matches.page.loader(fetchLoaderArgs(qs, prevPath, result as any, matches));
        }
        return result;
    });

    const previous = usePrevious(state);

    function fetchLoaderArgs(qs: any, prevPath: string, state: ContextState, matches: ContextState["matches"]) {
        const s = (state.location.state as any) ?? {};
        const alreadyRendered = state.matches?.page === matches?.page && state.cache !== null;
        const currentCache = cache.get(state.location.pathname) ?? null;
        const href = createHref(state.location.pathname, state.location.search, state.location.hash, config.basename);
        return {
            alreadyRendered,
            form: null,
            event: null,
            queryString: qs,
            link: config.link,
            links: config.links,
            cacheStore: cache,
            path: href as PathFormat,
            paths: matches.params ?? {},
            data: matches.page?.data ?? {},
            cache: currentCache,
            request: new Request(s.url ?? href, { headers: s.headers, signal: controller.current.signal }),
            prev: currentCache
                ? ({
                    path: prevPath,
                    data: previous.matches?.page?.data,
                    paths: previous.matches.params,
                    queryString: transformData(
                        urlEntity(prevPath).searchParams,
                        mapUrlToQueryStringRecord(previous?.matches?.page?.originalPath ?? "", fromStringToValue)
                    ),
                } as never)
                : null,
        };
    }

    const href = createHref(state.location.pathname, state.location.search, state.location.hash, config.basename);

    useEffect(() => {
        RouteEvents.start(href);
        const matches = findMatches(config, state.location.pathname, filter);
        const loader = matches.page?.loader;
        const page = matches.page;
        if (matches.page === null) RouteEvents.notFound(href);
        if (!(loader && page)) {
            if (matches.page !== null) RouteEvents.change(href);
            return void setState((p) => ({
                ...p,
                matches,
                loading: false,
                firstLoading: false,
                error: matches.error ?? null,
                loadingElement: matches.page?.loadingElement || p.loadingElement,
            }));
        }
        const request = async () => {
            setState((prev) => ({
                ...prev,
                loading: true,
                loadingElement: matches.page?.loadingElement || prev.loadingElement,
            }));
            const search = new URLSearchParams(state.location.search);
            const qs = transformData(search, mapUrlToQueryStringRecord(page.originalPath, fromStringToValue));
            const prevPath = createHref(
                previous.location.pathname,
                previous.location.search,
                previous.location.hash,
                config.basename
            );
            const loaderResult =
                state.loaderDataPromise instanceof Promise
                    ? await state.loaderDataPromise
                    : await loader(fetchLoaderArgs(qs, prevPath, state, matches));
            return { loaderData: loaderResult, loading: false, queryString: qs ?? {} };
        };
        void request().then((response) => {
            RouteEvents.changeWithLoader(href);
            setState((prev) => {
                cache.set(state.location.pathname, response.loaderData);
                if (cache.size >= cacheSize)
                    Array.from(cache.keys()).forEach((k, i) => (i < cacheSize ? cache.delete(k) : undefined));
                return {
                    ...prev,
                    matches: matches,
                    firstLoading: false,
                    actions: prev.actions,
                    loaderDataPromise: null,
                    loading: response.loading,
                    cache: response.loaderData,
                    error: matches.error ?? null,
                    loaderData: response.loaderData,
                    loadingElement: matches.page?.loadingElement,
                };
            });
        });
        return () => void controller.current.abort(new UnmountTimeout(state));
    }, [filter, href]);

    useEffect(() => {
        config.history.listen((changes) => void setState((p) => ({ ...p, location: changes.location })));
    }, [config.history]);

    const Fallback = useCallback(
        () => <Fragment>{state.matches.page?.errorElement || ErrorElement}</Fragment>,
        [state.matches]
    );

    const setError = useCallback((error: Error | null) => setState((prev) => ({ ...prev, error })), []);

    const setLoading = useCallback((loading: boolean) => setState((prev) => ({ ...prev, loading })), []);

    const context = {
        href,
        flags,
        config,
        setState,
        setLoading,
        cache: state.cache,
        actions: state.actions,
        matches: state.matches,
        loading: state.loading,
        location: state.location,
        basename: config.basename,
        paths: state.matches.params,
        navigation: config.navigation,
        loaderData: state.loaderData,
        firstLoading: state.firstLoading,
        error: state.matches.error ?? state.error,
        page: state.error !== null ? null : state.matches.page,
    };

    return (
        <Context.Provider value={context}>
            <CatchError fallback={Fallback} state={state} setError={setError}>
                {children}
            </CatchError>
        </Context.Provider>
    );
};
