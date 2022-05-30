import type { Story } from "./story";

export type Routes = {
  path: string;
  Component: React.FC<React.PropsWithChildren<any>>;
};

export type BoundaryHistoryProps = Boundaries & {
  state: ContextHistoryProps;
};

export type Boundaries = {
  Route404?: React.FC<React.PropsWithChildren<{ state: ContextHistoryProps }>>;
};

export type RouteProps<
  Params = object,
  QueryString = object,
  State = object
> = {
  hash: string;
  path: string;
  state: State;
  params: Params;
  search: string;
  queryString: QueryString;
};

export type StoryProps = ReturnType<typeof Story>;

export type ContextHistoryProps<
  Params = object,
  QueryString = object,
  State = object
> = RouteProps & {
  boundaries: Boundaries;
} & StoryProps & {
    Render: React.FC<
      React.PropsWithChildren<RouteProps<Params, QueryString, State>>
    >;
    state: object;
  };

export type UrlParams<
  T extends string,
  Separator extends string = "/"
> = string extends T
  ? Record<string, string>
  : T extends `${infer _}:${infer Param}${Separator}${infer Rest}`
  ? { [k in Param | keyof UrlParams<Rest, Separator>]: string }
  : T extends `${infer _}:${infer Param}`
  ? { [k in Param]: string }
  : {};

export type QueryString = Record<string, boolean | string | null>;
