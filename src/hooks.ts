import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { QS } from "./qs";
import { HistoryContext } from "./router";
import { match } from "path-to-regexp";

/**
 * Hook to access history context
 * @returns HistoryType & { params: object }
 */
export const useHistory = () => {
  const history = useContext(HistoryContext);
  return history;
};

/**
 * Transform URI paths in object, using the
 * `path` pattern from <Route />
 * @returns object using the same keys of URI path. Example: /:id -> { id: number }
 */
export const useParams = <T>(): T => {
  const ctx = useHistory();
  return ctx.params as never;
};

export const useLocation = () => {
  const { location } = useHistory();
  return location;
};

const getQs = <T>(): T => QS.parse<T>(window.location.href);

/**
 * Transform query string in object
 * @returns ?key=value -> { key: "value" }
 */
export const useQueryString = <T extends object>(): T => {
  const { location, listen } = useHistory();
  const qs = useRef(location.search);
  const [queryString, setQueryString] = useState<T>(getQs);
  useEffect(() => {
    listen((e) => {
      if (e.location.search !== qs.current) {
        qs.current = e.location.search;
        setQueryString(getQs);
      }
    });
  }, [listen]);
  return queryString;
};


export const isMatchRoute = (pattern: string, pathName: string) => {
  const regex = match(pattern);
  const matches = regex(pathName);
  return matches !== false;
};

/**
 * Check if pattern match with current URI pathname
 * @returns boolean of match `path pattern` x `history.location.pathname`
 */
export const useMatchRoute = (pattern: string) => {
  const history = useHistory();
  const isMatch = useMemo(() => {
    return isMatchRoute(pattern, history.location.pathname);
  }, [history.location.pathname, pattern]);
  return isMatch;
};
