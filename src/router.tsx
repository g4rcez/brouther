import {
  BrowserHistory,
  HashHistory,
  MemoryHistory,
  createPath,
  To,
} from "history";
import { pathToRegexp } from "path-to-regexp";
import React, {
  Children,
  createContext,
  FC,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useHistory } from "./hooks";

type HistoryType = BrowserHistory | HashHistory | MemoryHistory;

export const HistoryContext = createContext<
  HistoryType & {
    params: object;
  }
>({ params: {} } as any);
type RouteProps = {
  path: string;
  exact?: boolean;
  component: FC;
};
export const Route = (props: RouteProps) => {
  const router = useContext(HistoryContext);
  return <props.component {...(router as any)} />;
};

type MatchRoute = {
  regex: RegExp;
  path: string;
  component: FC;
  params: Array<{
    name: string;
    prefix: string;
    suffix: string;
    pattern: string;
    modifier: string;
  }>;
};

type RouterProps = {
  basename: string;
  notFound: FC;
  history: HistoryType;
};

type Render = {
  Component: FC<any>;
  params: { [k: string]: any };
};

const concatUrl = (base: string, uri: string) => new URL(base, uri).href;

/**
 * Brouther context to delivery history props/params and control the current component
 * to render from <Route />`s path
 */
export const Router: FC<RouterProps> = ({
  children,
  history,
  basename = "/",
  notFound: NotFound,
}) => {
  const History = useRef(history);

  const [pathName, setPathName] = useState(() =>
    concatUrl(basename, History.current.location.pathname)
  );
  const [location, setLocation] = useState(() => ({
    ...History.current.location,
    pathname: pathName,
  }));

  const init = useCallback(() => {
    const routes = Children.toArray(children).sort((a: any, b: any) => {
      const x: RouteProps = a.props;
      const y: RouteProps = b.props;
      const xHas = x.path.includes(":");
      const yHas = y.path.includes(":");
      if (!xHas || x.path === "/") return -1;
      if (yHas) return 1;
      return 0;
    });
    const rules = routes.map((x: any) => {
      const params: any[] = [];
      const regex = pathToRegexp(x.props.path, params, {
        sensitive: true,
        strict: x.props.exact ?? false,
      });
      return { ...x.props, regex, params };
    });
    return { routes, rules };
  }, [children]);

  const controller = useMemo<{
    rules: MatchRoute[];
    routes: any[];
  }>(init, [init]);

  useEffect(() => {
    History.current.listen((e) => {
      setLocation(e.location);
      setPathName(e.location.pathname);
    });
  }, []);

  const render = useMemo((): Render => {
    const params: any = {};
    if (pathName === "/") {
      const current = controller.routes.find((x) => x.props.path === "/");
      if (current) {
        return { Component: current.props.component, params };
      }
      return { Component: NotFound, params };
    }
    const index = controller.rules.findIndex((x) => {
      const exec = x.regex.exec(pathName);
      if (exec === null) return false;
      const [, ...groups] = exec;
      groups.forEach((val, i) => {
        const regex = x.params[i].name;
        try {
          params[regex] = JSON.parse(val);
        } catch (error) {
          params[regex] = val;
        }
      });
      return true;
    });
    const current = controller.routes[index];
    if (current === undefined) {
      return { Component: NotFound, params };
    }
    return { Component: current.props.component, params };
  }, [controller, NotFound, pathName]);

  const contextValue = useMemo(
    () => ({ ...History.current, params: render.params, ...history, location }),
    [location, render, history]
  );

  return (
    <HistoryContext.Provider value={contextValue}>
      <render.Component history={history} />
    </HistoryContext.Provider>
  );
};

type A = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> &
  Readonly<{
    href: To;
    state?: any;
  }>;

/**
 * Similar to <a />. But prevent default behavior of native link and
 * use history.push to `href`
 */
export const Link: React.FC<A> = ({ onClick, state, href, ...props }) => {
  const { push } = useHistory();

  const link = useMemo(
    () => (typeof href === "object" ? createPath(href) : href),
    [href]
  );

  const click = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      onClick?.(e);
      e.preventDefault();
      return push(href, state);
    },
    [onClick, href, state, push]
  );
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a {...props} href={link} onClick={click} />;
};

/**
 * Empty React.Fragment. Redirect to `href` on mount
 */
export const Redirect = ({ href }: { href: To }) => {
  const history = useHistory();
  const isMounted = useRef(true);
  useLayoutEffect(() => {
    if (isMounted.current) {
      setTimeout(() => history.push(href), 1);
    }
    return () => {
      isMounted.current = false;
    };
  }, [history, href]);
  return <Fragment></Fragment>;
};
