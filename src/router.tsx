import { BrowserHistory, createBrowserHistory, createPath, To } from "history";
import { pathToRegexp } from "path-to-regexp";
import React from "react";
import { useHistory } from "./hooks";

export const HistoryContext = React.createContext<
  BrowserHistory & {
    params: object;
    basename: string;
  }
>({ params: {} } as any);

const trimPath = (str: string) =>
  str.trim().replace(/^\/+/, "/").replace(/\/+$/, "/");

type RouteProps = {
  path: string;
  exact?: boolean;
  component: React.FC;
};
export const Route = (props: RouteProps) => {
  const router = React.useContext(HistoryContext);
  return <props.component {...(router as any)} />;
};

type MatchRoute = {
  regex: RegExp;
  path: string;
  component: React.FC;
  params: Array<{
    name: string;
    prefix: string;
    suffix: string;
    pattern: string;
    modifier: string;
  }>;
};

type RouterProps = {
  basename?: string;
  notFound: React.FC;
};

type Render = {
  Component: React.FC<any>;
  params: { [k: string]: any };
};

const concatUrl = (base: string, ...uri: string[]) =>
  uri.reduce(
    (acc, el) => acc.replace(/\/+$/, "") + "/" + el.replace(/^\/+/, ""),
    base
  );

/**
 * Brouther context to delivery history props/params and control the current component
 * to render from <Route />`s path
 */
export const Router: React.FC<RouterProps> = ({
  children,
  basename = "/",
  notFound: NotFound,
}) => {
  const History = React.useRef(createBrowserHistory());

  const [pathname, setPathName] = React.useState(() => {
    const p = History.current.location.pathname;
    return p.startsWith(basename)
      ? p
      : concatUrl(basename, History.current.location.pathname);
  });

  const [location, setLocation] = React.useState(() => ({
    ...History.current.location,
    pathname,
  }));

  const init = React.useCallback(() => {
    const routes = React.Children.toArray(children).sort((a: any, b: any) => {
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
      const path = concatUrl(basename, x.props.path);
      const regex = pathToRegexp(path, params, {
        sensitive: true,
        strict: x.props.exact ?? false,
      });
      return { ...x.props, path, regex, params };
    });
    return { routes, rules };
  }, [children, basename]);

  const controller = React.useMemo<{
    rules: MatchRoute[];
    routes: any[];
  }>(init, [init]);

  React.useEffect(() => {
    History.current.listen((e) => {
      setLocation(e.location);
      setPathName(e.location.pathname);
    });
  }, []);

  const render = React.useMemo((): Render => {
    const params: any = {};
    if (pathname === basename) {
      const current = controller.routes.find((x) => x.props.path === "/");
      if (current) {
        return { Component: current.props.component, params };
      }
      return { Component: NotFound, params };
    }
    const index = controller.rules.findIndex((x) => {
      const exec = x.regex.exec(pathname);
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
  }, [controller, NotFound, pathname, basename]);

  const contextValue = React.useMemo(
    () => ({ ...History.current, params: render.params, location, basename }),
    [location, render, basename]
  );

  return (
    <HistoryContext.Provider value={contextValue}>
      <render.Component history={History} />
    </HistoryContext.Provider>
  );
};

type Anchor = React.DetailedHTMLProps<
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
export const Link: React.FC<Anchor> = ({ onClick, state, href, ...props }) => {
  const { push, basename } = useHistory();

  const link = React.useMemo(() => {
    const trim = trimPath(basename);
    const basenameRegexp = new RegExp(`^/${trim}`);
    if (typeof href === "string") {
      if (basenameRegexp.test(href)) return href;
      return `${trim}${trimPath(href)}`;
    }
    if (basenameRegexp.test(href)) return createPath(href);
    return createPath({
      ...(href as object),
      pathname: `/${trim}${trimPath(href.pathname!)}`,
    });
  }, [href, basename]);

  const click = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      onClick?.(e);
      e.preventDefault();
      return push(link, state);
    },
    [onClick, link, state, push]
  );
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a {...props} href={link} onClick={click} />;
};

/**
 * Empty React.Fragment. Redirect to `href` on mount
 */
export const Redirect = ({ href }: { href: To }) => {
  const history = useHistory();
  const isMounted = React.useRef(true);
  React.useEffect(() => {
    if (isMounted.current) {
      setTimeout(() => history.push(href), 1);
    }
    return () => {
      isMounted.current = false;
    };
  }, [history, href]);
  return <React.Fragment></React.Fragment>;
};
