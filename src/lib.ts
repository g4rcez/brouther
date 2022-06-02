import {
  parse as parseQs,
  ParseOptions,
  stringify as stringifyQs,
} from "query-string";
import React from "react";
import { NominalRoute, InferRouteProps, QueryString } from "./types";

export const QueryStringParseOptions: ParseOptions = {
  decode: true,
  parseBooleans: true,
  parseNumbers: false,
};

export const modifiedEvent = (e: React.MouseEvent) =>
  !!(e.altKey || e.ctrlKey || e.metaKey || e.shiftKey);

export const preventLinkDefault = (
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
) => {
  const el = event.currentTarget;
  const target = el.target || "_self";
  if (event.button === 0 && target === "_self" && !modifiedEvent(event))
    return event.preventDefault();
};

export const isReactFragment = (Component: any) => Component === React.Fragment;

export function usePrevious<T>(value: T) {
  const ref = React.useRef(value);
  React.useEffect(() => void (ref.current = value), [value]);
  return ref.current;
}

export const createSafeUrl = (pathname: string) =>
  new URL(pathname, window.location.origin);

export const stringifyQueryString = (qs: object) =>
  stringifyQs(qs, { encode: false });

export const parseQueryString = <T extends QueryString>(search?: string): T =>
  parseQs(search ?? window.location.search, QueryStringParseOptions) as never;

export const createUrlWithNewQueryString = (qs: any) => {
  const path = createSafeUrl(window.location.pathname);
  path.search = stringifyQs(qs);
  return path.href;
};

export const createRoute = <Path extends string>(
  path: Path,
  Component: (
    props: InferRouteProps<Path>
  ) => React.ReactElement<any, any> | null
): NominalRoute<Path> => ({ Component, path, __type: "@brouther/nominal" });
