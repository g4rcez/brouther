import {
  parse as parseQs,
  ParseOptions,
  stringify as stringifyQs,
} from "query-string";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import { createSafeUrl } from "./lib";
import { useGotoLink } from "./router";

type QueryString = Record<string, boolean | string | null>;

export const QueryStringParseOptions: ParseOptions = {
  parseBooleans: true,
  parseNumbers: false,
  decode: true,
};

export const stringifyQueryString = (qs: object) =>
  stringifyQs(qs, { encode: false });

export const parseQueryString = (str: string) =>
  parseQs(str, QueryStringParseOptions);

const createQs = <T extends QueryString>(): T =>
  parseQueryString(window.location.search) as never;

const createUrlWithNewQueryString = (qs: any) => {
  const path = createSafeUrl(window.location.pathname);
  path.search = stringifyQs(qs);
  return path.href;
};

export const useQueryString = <T extends QueryString>(): [
  queryString: T,
  setQueryString: React.Dispatch<SetStateAction<T>>
] => {
  const [queryString, setQueryString] = useState<T>(createQs);
  const goTo = useGotoLink();

  const onSetQueryString: React.Dispatch<SetStateAction<T>> = useCallback(
    (args): void => {
      const newQs = typeof args === "function" ? args(createQs()) : args;
      const newPath = createUrlWithNewQueryString(newQs);
      goTo(newPath);
      setQueryString(newQs);
    },
    [goTo]
  );

  useEffect(() => {
    let oldHref = window.location.search;
    const observer = new MutationObserver(() => {
      if (oldHref === document.location.search) return;
      oldHref = document.location.href;
      onSetQueryString(createQs);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
    };
  }, [onSetQueryString]);

  return [queryString, onSetQueryString];
};
