import { useContext, useEffect, useRef, useState } from "react";
import { QS } from "./qs";
import { HistoryContext } from "./router";

export const useHistory = () => {
  const history = useContext(HistoryContext);
  return history;
};

export const useParams = <T>(): T => {
  const ctx = useHistory();
  return ctx.params as never;
};

export const useLocation = () => {
  const { location } = useHistory();
  return location;
};

const getQs = <T>(): T => QS.parse<T>(window.location.href);

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
