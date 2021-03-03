import { createBrowserHistory } from "history";
import { pathToRegexp } from "path-to-regexp";
import React, {
  Children,
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const History = createBrowserHistory();

export const HistoryContext = createContext({ ...History, params: {} });
type RouteProps = {
  path: string;
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
  notFound: FC;
};

type Render = {
  Component: FC<any>;
  params: { [k: string]: any };
};

export const Router: FC<RouterProps> = ({ children, notFound: NotFound }) => {
  const [location, setLocation] = useState(() => History.location);
  const [pathName, setPathName] = useState(History.location.pathname);

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
      const regex = pathToRegexp(x.props.path, params);
      return { ...x.props, regex, params };
    });
    return { routes, rules };
  }, [children]);

  const controller = useMemo<{
    rules: MatchRoute[];
    routes: any[];
  }>(init, [init]);

  useEffect(() => {
    History.listen((e) => {
      setLocation(e.location);
      setPathName(e.location.pathname);
    });
  }, []);

  const render = useMemo((): Render => {
    const params: any = {};
    if (pathName === "/") {
      const current = controller.routes.find((x) => x.props.path === "/");
      if (current) return { Component: current.props.component, params };
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

  const historyComponent = useMemo(() => ({ ...History, location }), [
    location,
  ]);

  return (
    <HistoryContext.Provider value={{ ...History, params: render.params }}>
      <render.Component history={historyComponent} />
    </HistoryContext.Provider>
  );
};

type A = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> &
  Readonly<{
    href: string;
    state?: any;
  }>;

export const Link: React.FC<A> = ({ onClick, state, href, ...props }) => {
  const click = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();
      onClick?.(e);
      if (!href.startsWith("http")) return History.push(href, state);
    },
    [onClick, href, state]
  );
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a {...props} href={href} onClick={click} />;
};

export const useHistory = () => {
  const [history, setHistory] = useState(() => History);
  useEffect(() => {
    History.listen((e) => setHistory({ ...History, ...e.location }));
  }, []);
  return history;
};

export const useLocation = () => {
  const [history, setHistory] = useState(() => History.location);
  useEffect(() => {
    History.listen((e) => setHistory(e.location));
  }, []);
  return history;
};
