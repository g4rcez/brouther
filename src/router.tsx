import { match } from "path-to-regexp";
import React, { useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "./error-boundary";
import { createSafeUrl, isFragment } from "./lib";
import { Story } from "./story";
import {
  Boundaries,
  ErrorBoundaryProps,
  InternalState,
  Routes,
  StoryProps,
} from "./types";
import { parseQueryString } from "./use-query-string";

const getQueryString = () => parseQueryString(window.location.search);

const ctx = React.createContext<InternalState>({
  boundaries: { Route404: React.Fragment },
  state: {},
  params: {},
  Render: React.Fragment,
  hash: window.location.hash,
  queryString: getQueryString(),
  path: window.location.pathname,
  search: window.location.search,
  ...Story(),
});

const matchRoute = (target: Routes, path: string) =>
  match(target.path, { decode: window.decodeURIComponent })(path);

const createCurrentState = (
  path: string,
  history: StoryProps,
  boundaries: Boundaries,
  route?: Routes
) => {
  const defaultResult: InternalState = {
    ...history,
    path,
    params: {},
    boundaries,
    Render: React.Fragment,
    hash: window.location.hash,
    state: window.history.state,
    queryString: getQueryString(),
    search: window.location.search,
  };
  if (!route) return defaultResult;
  const result = matchRoute(route, path) ?? {};
  if (result === false) return defaultResult;
  return { ...defaultResult, params: result.params, Render: route.Component };
};

export const Brouther = ({
  children,
  routes,
  Route404,
  static: staticRender = false,
}: React.PropsWithChildren<
  Omit<ErrorBoundaryProps, "state"> & {
    routes: Routes[];
    static?: boolean;
  }
>) => {
  const [path, setPath] = useState(window.location.pathname);
  const boundaries = useMemo(() => ({ Route404 }), [Route404]);

  const [story] = React.useState(() => {
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
  });

  const [routeState, setState] = React.useState<InternalState>(() => {
    const route = routes.find((route) => !!matchRoute(route, path));
    const result = createCurrentState(path, story, boundaries, route);
    return { ...result, ...story, boundaries };
  });

  useEffect(() => {
    const onPopState = () => {
      setPath(window.location.pathname);
      const result = createCurrentState(
        window.location.pathname,
        story,
        boundaries
      );
      setState((prev) => ({
        ...result,
        ...story,
        Render: prev.Render,
      }));
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
    const route = routes.find((route) => !!matchRoute(route, safePath));
    const result = createCurrentState(safePath, story, boundaries, route);
    if (route === undefined) {
      return setState((prev) => ({
        ...prev,
        ...result,
        ...story,
        Render: boundaries.Route404 ?? (React.Fragment as any),
      }));
    }
    setState((prev) =>
      result.Render !== prev.Render ? { ...result, ...story, boundaries } : prev
    );
  }, [story, routes, path, boundaries]);

  const Render = routeState.Render;

  return (
    <ctx.Provider value={routeState}>
      <ErrorBoundary state={routeState} Route404={Route404}>
        {children}
        {isFragment(Render) || staticRender ? (
          <React.Fragment />
        ) : (
          <Render
            path={path}
            hash={routeState.hash}
            state={routeState.state}
            params={routeState.params}
            search={routeState.search}
            queryString={routeState.queryString}
          />
        )}
      </ErrorBoundary>
    </ctx.Provider>
  );
};

export const useRouter = () => {
  const { Render, boundaries, ...state } = React.useContext(ctx);
  return state;
};

export const useGotoLink = () => {
  const { go } = useRouter();
  return go;
};

type UrlParams<T extends string> = string extends T
  ? Record<string, string>
  : T extends `${infer _}:${infer Param}/${infer Rest}`
  ? { [k in Param | keyof UrlParams<Rest>]: string }
  : T extends `${infer _}:${infer Param}`
  ? { [k in Param]: string }
  : {};

export const useUrlParams = <Path extends string>(
  _?: Path
): Path extends undefined ? object : UrlParams<Path> => {
  const { params } = useRouter();
  return params as never;
};

export const useComponentRoute = () => {
  const state = React.useContext(ctx);
  if (isFragment(state.Render)) return <React.Fragment />;
  return (
    <ErrorBoundary state={state} Route404={(state as any).boundaries.Route404}>
      {
        <state.Render
          path={state.path}
          hash={state.hash}
          state={state.state}
          params={state.params}
          search={state.search}
          queryString={state.queryString}
        />
      }
    </ErrorBoundary>
  );
};
