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
  hash: InferHash<Url>;
  params: Params extends Dict ? InferUrlParams<Url> : State;
  queryString: QueryString extends Dict ? InferQueryString<Url> : State;
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

export type InferUrlParams<
  T extends string,
  PrefixVar extends string = ":",
  Separator extends string = "/" | ","
> = string extends T
  ? Record<string, string>
  : T extends `${infer _}${PrefixVar}${infer Param}${Separator}${infer Rest}`
  ? { [k in Param | keyof InferUrlParams<Rest, PrefixVar, Separator>]: string }
  : T extends `${infer _}${PrefixVar}${infer Param}`
  ? { [k in Param]: string }
  : {};

export type InferQueryString<T extends string> = string extends T
  ? Record<string, string>
  : T extends `${infer _}?${infer Param}&${infer Rest}`
  ? { [k in Param | keyof InferQueryString<Rest>]: string }
  : T extends `${infer _}?${infer Param}#${infer __}`
  ? { [k in Param]: string }
  : Dict;

export type InferHash<T extends string> =
  T extends `${infer _}#${infer Param}#}${infer Rest}`
    ? { [k in Param | keyof InferHash<Rest>]: string }
    : T extends `${infer _}#${infer Param}`
    ? Param
    : string;

export type QueryString = Record<string, boolean | string | null>;

export type InferRouteProps<Path extends string> = RouteProps<Path>;

export type NominalRoute<T extends string = string> = {
  path: T;
  __type: "@brouther/nominal";
  Component: (
    props: InferRouteProps<T>
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
