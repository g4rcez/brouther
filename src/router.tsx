import { match } from "path-to-regexp";
import React, { useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "./error-boundary";
import { createSafeUrl, isReactFragment, parseQueryString } from "./lib";
import { Story } from "./story";
import {
  Boundaries,
  BoundaryHistoryProps,
  NominalRoute,
  ContextHistoryProps,
  Dict,
  Hide,
  RouteProps,
  Route,
  StoryProps,
  UrlParams,
} from "./types";

const ctx = React.createContext<ContextHistoryProps>({
  boundaries: { Route404: React.Fragment },
  state: {},
  params: {},
  Render: React.Fragment,
  hash: window.location.hash,
  search: window.location.search,
  path: window.location.pathname,
  queryString: parseQueryString(),
  ...Story(),
});

const matchRoute = (target: Route, path: string) =>
  match(target.path, { decode: window.decodeURIComponent })(path);

const createCurrentState = (
  path: string,
  searchParams: string,
  history: StoryProps,
  boundaries: Boundaries,
  route?: Route
): ContextHistoryProps => {
  const defaultResult: ContextHistoryProps = {
    ...history,
    path,
    params: {},
    boundaries,
    search: searchParams,
    Render: React.Fragment,
    hash: window.location.hash,
    state: window.history.state,
    queryString: parseQueryString(),
  };
  if (!route) return defaultResult;
  const result = matchRoute(route, path) ?? {};
  if (result === false) return defaultResult;
  return {
    ...defaultResult,
    params: result.params as Dict,
    Render: route.Component,
  };
};

export const Brouther = <
  T extends {
    [K in keyof T]: T[K] extends NominalRoute<infer Path>
      ? NominalRoute<Path>
      : NominalRoute;
  }
>({
  children,
  routes,
  Route404,
  static: staticRender = false,
}: React.PropsWithChildren<
  Omit<BoundaryHistoryProps, "state"> & {
    routes: T;
    static?: boolean;
  }
>) => {
  const [path, setPath] = useState(window.location.pathname);
  const boundaries = useMemo(() => ({ Route404 }), [Route404]);
  const typedRoutes = useMemo(() => {
    const keys = Object.values(routes) as Route[];
    return keys
      .map((route) => {
        const sanitizePath = route.path
          .replace(/\?.*$/, "")
          .replace(/#.*$/, "");
        const trailingPath = sanitizePath.replace(/(\/+)$/, "");
        return { ...route, path: trailingPath };
      })
      .sort((a) => (a.path.includes(":") ? 1 : -1));
  }, [routes]);

  const story = React.useMemo(() => {
    const story = Story();
    const getPrevState = () => window.history?.state?.previousState;
    const updateStates = () => {
      setState((prev) => {
        if (prev.search !== window.location.search) {
          prev.search = window.location.search;
          prev.queryString = parseQueryString(window.location.search);
        }
        if (prev.hash !== window.location.hash) {
          prev.hash = window.location.hash;
        }
        return prev;
      });
    };
    const goOrReplace =
      (exec: typeof story.go) => (path: string, state?: object) => {
        exec(path, { previousState: getPrevState(), state });
        setPath(path);
        updateStates();
      };
    return {
      ...story,
      go: goOrReplace(story.go),
      replace: goOrReplace(story.replace),
    };
  }, []);

  const [state, setState] = React.useState<ContextHistoryProps>(() => {
    const route = typedRoutes.find((route) => !!matchRoute(route, path));
    const result = createCurrentState(
      path,
      window.location.search,
      story,
      boundaries,
      route
    );
    return { ...result, ...story, boundaries };
  });

  useEffect(() => {
    const onPopState = () => {
      setPath(window.location.pathname);
      const result = createCurrentState(
        window.location.pathname,
        window.location.search,
        story,
        boundaries
      );
      setState((prev) => ({ ...result, ...story, Render: prev.Render }));
    };
    const onHashChange = () => {
      setState((prev) => ({ ...prev, hash: window.location.hash }));
    };
    window.addEventListener("popstate", onPopState);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [boundaries, path, story]);

  React.useEffect(() => {
    const safePath = createSafeUrl(path).pathname;
    const route = typedRoutes.find((route) => !!matchRoute(route, safePath));
    const result = createCurrentState(
      safePath,
      state.search,
      story,
      boundaries,
      route
    );
    if (route === undefined) {
      return setState((prev) => ({
        ...prev,
        ...result,
        ...story,
        Render: boundaries.Route404 ?? (React.Fragment as any),
      }));
    }
    setState((prev) => ({
      ...prev,
      ...result,
      ...story,
      boundaries,
      Render: result.Render !== prev.Render ? result.Render : prev.Render,
    }));
  }, [story, path, boundaries, state.search, typedRoutes]);

  return (
    <ctx.Provider value={state}>
      <ErrorBoundary state={state} Route404={Route404}>
        {children}
        {isReactFragment(state.Render) || staticRender ? (
          <React.Fragment />
        ) : (
          <state.Render
            path={path}
            hash={state.hash}
            state={state.state}
            params={state.params}
            search={state.search}
            queryString={state.queryString}
          />
        )}
      </ErrorBoundary>
    </ctx.Provider>
  );
};

export const useRouter = <Route extends string = string>(
  url?: Route
): Route extends undefined
  ? Hide<ContextHistoryProps, "Render" | "boundaries">
  : RouteProps<Route> & Hide<ContextHistoryProps, "Render" | "boundaries"> => {
  const { Render, boundaries, ...state } = React.useContext(ctx);
  return state as never;
};

export const useGotoLink = () => {
  const { go } = useRouter();
  return go;
};

export const useUrlParams = <
  Path extends string,
  Separator extends string = "/"
>(
  _?: Path
): Path extends undefined ? object : UrlParams<Path, Separator> => {
  const { params } = useRouter();
  return params as never;
};

export const useComponentRoute = () => {
  const state = React.useContext(ctx);
  if (isReactFragment(state.Render)) return <React.Fragment />;
  return (
    <ErrorBoundary state={state} Route404={(state as any).boundaries.Route404}>
      <state.Render
        path={state.path}
        hash={state.hash}
        state={state.state}
        params={state.params}
        search={state.search}
        queryString={state.queryString}
      />
    </ErrorBoundary>
  );
};
