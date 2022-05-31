import React from "react";
import type { Story } from "./story";

export type Hide<T, K extends keyof T> = Omit<T, K>;

export type Route = {
  path: string;
  Component: (props: any) => React.ReactElement<any, any> | null;
};

export type BoundaryHistoryProps = Boundaries & {
  state: ContextHistoryProps;
};

export type Boundaries = {
  Route404?: React.FC<React.PropsWithChildren<{ state: ContextHistoryProps }>>;
};

export type Dict = Record<string, string>;

export type RouteProps<
  Url extends string = string,
  Params = Dict,
  QueryString = Dict,
  State = object
> = {
  path: string;
  state: State;
  search: string;
  hash: ExtractHash<Url>;
  params: Params extends Dict ? UrlParams<Url> : State;
  queryString: QueryString extends Dict ? ExtractQueryString<Url> : State;
};

export type StoryProps = ReturnType<typeof Story>;

export type ContextHistoryProps<
  Url extends string = string,
  Params = Dict,
  QueryString = Dict,
  State = object
> = RouteProps & {
  boundaries: Boundaries;
} & StoryProps & {
    Render: React.FC<
      React.PropsWithChildren<RouteProps<Url, Params, QueryString, State>>
    >;
    state: object;
  };

export type UrlParams<
  T extends string,
  PrefixVar extends string = ":",
  Separator extends string = "/" | ","
> = string extends T
  ? Record<string, string>
  : T extends `${infer _}${PrefixVar}${infer Param}${Separator}${infer Rest}`
  ? { [k in Param | keyof UrlParams<Rest, PrefixVar, Separator>]: string }
  : T extends `${infer _}${PrefixVar}${infer Param}`
  ? { [k in Param]: string }
  : {};

export type ExtractQueryString<T extends string> = string extends T
  ? Record<string, string>
  : T extends `${infer _}?${infer Param}&${infer Rest}`
  ? { [k in Param | keyof ExtractQueryString<Rest>]: string }
  : T extends `${infer _}?${infer Param}#${infer __}`
  ? { [k in Param]: string }
  : Dict;

export type ExtractHash<T extends string> =
  T extends `${infer _}#${infer Param}#}${infer Rest}`
    ? { [k in Param | keyof ExtractHash<Rest>]: string }
    : T extends `${infer _}#${infer Param}`
    ? Param
    : string;

export type QueryString = Record<string, boolean | string | null>;

export type CreateRouteProps<Path extends string> = RouteProps<Path>;

export type NominalRoute<T extends string = string> = {
  path: T;
  __type: "@brouther/nominal";
  Component: (
    props: CreateRouteProps<T>
  ) => React.ReactElement<any, any> | null;
};

export type ExtractRouteProps<
  T extends {
    [K in keyof T]: T[K] extends NominalRoute<infer Path>
      ? NominalRoute<Path>
      : NominalRoute;
  },
  U extends keyof T
> = Parameters<T[U]["Component"]>[0];
