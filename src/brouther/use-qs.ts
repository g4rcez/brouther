import { useEffect, useRef, useState } from "react";
import { QS } from "./qs";
import { History } from "./router";

const getQs = <T>(): T => QS.parse<T>(window.location.href);

export const useQueryString = <T extends object>(): T => {
  const qs = useRef(History.location.search);
  const [queryString, setQueryString] = useState<T>(getQs);
  useEffect(() => {
    History.listen((e) => {
      if (e.location.search !== qs.current) {
        qs.current = e.location.search;
        setQueryString(getQs);
      }
    });
  }, []);
  return queryString;
};
