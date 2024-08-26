import React, { createContext, Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { RouterNavigator } from "../router/router-navigator";
import type { BroutherFlags, ConfiguredRoute, Location, PathFormat } from "../types";
import { BrowserHistory } from "../types/history";
import type { Paths } from "../types/paths";
import type { QueryString } from "../types/query-string";
import { X } from "../types/x";
import { BroutherError, NotFoundRoute, UncaughtDataLoader } from "../utils/errors";
import { fromStringToValue, transformParams } from "../utils/mappers";
import { createHref, join, mapUrlToQueryStringRecord, trailingPath, transformData, urlEntity } from "../utils/utils";
import { CustomResponse, InferLoader } from "./brouther-response";
import { CatchError } from "./catch-error";

type ActionState<R = any> =
    | {
          state: "idle";
          loading: false;
      }
    | {
          loading: true;
          state: "submitting";
      }
    | {
          loading: false;
          state: "submitted";
          result: undefined | R;
          response: CustomResponse<any>;
      };

type InitialState = {
    loading: boolean;
    location: Location;
    actions: ActionState;
    error: X.Nullable<BroutherError>;
    loaderData: X.Nullable<Response>;
    matches: { page: any; error: null; params: any } | { page: null; error: NotFoundRoute; params: any };
};

export type ContextProps = InitialState & {
    basename: string;
    config: Base;
    error: X.Nullable<BroutherError | Error>;
    flags?: BroutherFlags;
    href: string;
    loaderData: X.Nullable<Response>;
    loading: boolean;
    location: Location;
    navigation: RouterNavigator;
    page: X.Nullable<ConfiguredRoute>;
    paths: {};
    setLoading: (b: boolean) => void;
    setState: (stateOrFn: Omit<InitialState, "setState"> | ((prev: Omit<InitialState, "setState">) => Omit<InitialState, "setState">)) => void;
};

const Context = createContext<ContextProps | undefined>(undefined);

type Base = {
    basename: string;
    history: BrowserHistory;
    routes: ConfiguredRoute[];
    navigation: RouterNavigator;
    links: any;
    link: any;
};

export type BroutherProps<T extends Base> = React.PropsWithChildren<{
    config: Base;
    flags?: BroutherFlags;
    ErrorElement?: React.ReactElement;
    filter?: (route: T["routes"][number], config: T) => boolean;
}>;

const findMatches = (config: Base, pathName: string, filter: BroutherProps<any>["filter"]) => {
    const r = filter ? config.routes.filter((route) => filter(route, config)) : config.routes;
    const route = trailingPath(pathName) || "/";
    const page = r.find((x) => x.regex.test(route)) ?? null;
    const existPage = page !== null;
    const params = existPage ? transformParams(page.regex.exec(route)?.groups ?? {}) : {};
    return existPage ? { page, error: null, params } : { page: null, error: new NotFoundRoute(route), params };
};

/*
    Brouther context to configure all routing ecosystem
 */
export const Brouther = <T extends Base>({ config, flags, ErrorElement, children, filter }: BroutherProps<T>) => {
    const running = useRef(false);
    const [state, setState] = useState<InitialState>(() => ({
        loading: false,
        actions: { state: "idle", loading: false },
        error: null as X.Nullable<BroutherError>,
        location: config.history.location,
        loaderData: null as X.Nullable<Response>,
        matches: findMatches(config, config.history.location.pathname, filter),
    }));

    useEffect(() => {
        const result = findMatches(config, state.location.pathname, filter);
        const loader = result.page?.loader;
        const page = result.page;
        if (!(loader && page)) {
            return void setState((p) => ({ ...p, matches: result, error: result.error ?? null }));
        }
        if (running.current) return;
        const request = async () => {
            running.current = true;
            setState((prev) => ({ ...prev, loading: true }));
            const search = new URLSearchParams(state.location.search);
            const qs = transformData(search, mapUrlToQueryStringRecord(page.originalPath, fromStringToValue));
            const s = (state.location.state as any) ?? {};
            const r = await loader({
                form: null,
                event: null,
                link: config.link,
                links: config.links,
                queryString: qs,
                path: href as PathFormat,
                paths: result.params ?? {},
                data: result.page?.data ?? {},
                request: new Request(s.url ?? href, { body: s.body ?? undefined, headers: s.headers }),
            });
            running.current = false;
            return { loaderData: r, loading: false };
        };
        return void request().then((response) =>
            setState((prev) => ({
                ...prev,
                error: result.error ?? null,
                loaderData: response.loaderData,
                loading: response.loading,
                matches: result,
            }))
        );
    }, [findMatches, state.location.search, state.location.state, config, filter, state.location.pathname]);

    useEffect(() => {
        config.history.listen((changes) => setState((p) => ({ ...p, location: { ...changes.location } })));
    }, [config.history]);

    const href = createHref(state.location.pathname, state.location.search, state.location.hash, config.basename);

    const Fallback = useCallback(() => <Fragment>{state.matches.page?.errorElement || ErrorElement}</Fragment>, [state.matches]);

    const setError = useCallback((error: Error | null) => setState((prev) => ({ ...prev, error })), []);

    const setLoading = useCallback((loading: boolean) => setState((prev) => ({ ...prev, loading })), []);

    const context = {
        setState,
        actions: state.actions,
        matches: state.matches,
        config,
        basename: config.basename,
        error: state.matches.error ?? state.error,
        href,
        loaderData: state.loaderData,
        loading: state.loading,
        location: state.location,
        navigation: config.navigation,
        flags,
        setLoading,
        page: state.error !== null ? null : state.matches.page,
        paths: state.matches.params,
    };

    return (
        <Context.Provider value={context}>
            <CatchError fallback={Fallback} state={state} setError={setError}>
                {children}
            </CatchError>
        </Context.Provider>
    );
};

/*
    @private
*/
export const useBrouther = (): ContextProps => {
    const ctx = useContext(Context);
    if (ctx === undefined) throw new Error("Context error");
    return ctx;
};

/*
    The current url with pathname, query-string and hash
    @returns string
*/
export const useHref = () => useBrouther().href;

/*
    The element that matches with the current URL
*/
export const usePage = () => useBrouther().page?.element ?? null;

/*
    Instance of any occurred error in r
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
export const usePaths: UsePaths = <T extends string>(_path?: T): Paths.Parse<T> => useBrouther().paths! as any;

/*
    The representation of the query-string, but as simple plain javascript object
 */
export const useQueryString = <T extends {} | string>(_?: T): T extends string ? QueryString.Parse<T> : T => {
    const { href, page } = useBrouther();
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
export const useNavigation = (): RouterNavigator => useBrouther().navigation;

/*
    Get current basename
    @returns string
 */
export const useBasename = (): string => useBrouther().basename;

/*
    Get the current route as URL object
    @returns [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL)
 */
export const useURL = (): URL => {
    const { basename, href } = useBrouther();
    return useMemo(() => urlEntity(href, join(window.location.origin, basename)), [href, basename]);
};

const useLoader = <T extends unknown>(): X.Nullable<T> => useBrouther().loaderData as never;

const defaultLoaderParser = async (r: Response) => {
    const json = await r.json();
    return json;
};

type DataLoader = (a: Response) => any;

type Fn = (...a: any[]) => any;

export function useDataLoader<T extends DataLoader>(fn: T): ReturnType<T> | null;

export function useDataLoader<T extends Fn>(): Awaited<InferLoader<T>> | null;
export function useDataLoader<T extends DataLoader>(fn: (response: Response) => Promise<ReturnType<T>> = defaultLoaderParser) {
    const data = useLoader();
    const [state, setState] = useState(() => {
        if (data instanceof Response) {
            if ((data as any).result) {
                return (data as any).result;
            }
        }
        return data;
    });
    useEffect(() => {
        const async = async () => {
            if (data instanceof Response) {
                if ((data as any).result) {
                    return (data as any).result;
                }
                return fn(data);
            }
            return null;
        };
        async()
            .then(setState)
            .catch((error) => {
                throw new UncaughtDataLoader(error);
            });
    }, [data]);
    return state;
}

/*
    Get current error and the current page that throw the error
    @returns string
 */
export const useRouteError = () => {
    const router = useBrouther();
    return [router.error, router.page] as const;
};

/*
    Render the page that match with your route
    @returns string
 */
export const Outlet = (props: { notFound?: React.ReactElement }) => {
    const page = usePage();
    return props.notFound ? <Fragment>{page ? page : props.notFound}</Fragment> : <Fragment>{page}</Fragment>;
};

/*
    Boolean that represents if it's your action/loader process is loading
    @returns string
 */
export const useLoadingState = () => useBrouther().loading;

/*
    @private
*/
export const useFlags = () => useBrouther().flags;

const useStableRef = <V extends any>(value: V) => {
    const v = useRef(value);
    useEffect(() => {
        v.current = value;
    }, [value]);
    return v;
};

export const useBeforeUnload = (fn: (event: BeforeUnloadEvent) => void) => {
    const func = useStableRef(fn);
    useEffect(() => {
        const closure = (e: BeforeUnloadEvent) => func.current(e);
        window.addEventListener("beforeunload", closure);
        return () => window.addEventListener("beforeunload", closure);
    }, []);
};

export const usePageStats = () => useBrouther().page;

export const useFormActions = <R extends object>(): ActionState<R> => useBrouther().actions;
