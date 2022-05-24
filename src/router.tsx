import { match } from "path-to-regexp";
import { parse as searchParser } from "query-string";
import React, { useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "./error-boundary";
import { isFragment } from "./lib";
import { Story } from "./story";
import {
  Boundaries,
  ErrorBoundaryProps,
  InternalState,
  Routes,
  StoryProps,
} from "./types";

const getQueryString = () =>
  searchParser(window.location.search, {
    decode: true,
    parseNumbers: true,
  });

const ctx = React.createContext<InternalState>({
  boundaries: { Route404: React.Fragment },
  state: {},
  path: window.location.pathname,
  Render: React.Fragment,
  hash: window.location.hash,
  params: {},
  search: getQueryString(),
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
    search: getQueryString(),
    hash: window.location.hash,
    state: window.history.state,
  };
  if (!route) return defaultResult;
  const result = matchRoute(route, path) ?? {};
  if (result === false) return defaultResult;
  return { ...defaultResult, params: result.params, Render: route.Component };
};

export const History = ({
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
    return {
      back: story.back,
      history: story.history,
      forward: story.forward,
      replace: (path: string, state?: object) => {
        setPath(path);
        story.replace(path, { previousState: getPrevState(), state });
      },
      go: (path: string, state?: object) => {
        setPath(path);
        story.go(path, { previousState: getPrevState(), state });
      },
    };
  });

  const [routeState, setState] = React.useState<InternalState>(() => {
    const route = routes.find((route) => !!matchRoute(route, path));
    const result = createCurrentState(path, story, boundaries, route);
    return { ...result, ...story, boundaries };
  });

  useEffect(() => {
    const onPopState = () => {
      const newPath = window.location.pathname;
      setPath(newPath);
      const result = createCurrentState(newPath, story, boundaries);
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
    const route = routes.find((route) => !!matchRoute(route, path));
    const result = createCurrentState(path, story, boundaries, route);
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
        />
      }
    </ErrorBoundary>
  );
};
