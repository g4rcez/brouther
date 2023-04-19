import type React from "react";
import type { Function, Number, Object, Union } from "ts-toolbelt";
import type { RouterNavigator } from "../router-navigator";
import type { QueryString } from "./query-string";
import type { Paths } from "./paths";
import { BrowserHistory } from "./history";

export type Nullable<T> = T | null;

export type Hide<T, K extends keyof T> = Omit<T, K>;

type RouteData = Record<string, string> | undefined;

export type Router<Data extends RouteData = {}> = Record<string, Hide<Route, "id">>;

export type Route<Data extends RouteData = {}> = {
    id: Readonly<string>;
    path: Readonly<string>;
    element: React.ReactElement;
    data?: Data;
};

export type ConfiguredRoute<Data extends RouteData = {}> = Route<Data> & { regex: RegExp; originalPath: string };

export type FetchPaths<Routes extends Function.Narrow<Route[]>> = NonNullable<{ [_ in keyof Routes[number]]: Routes[number]["path"] }["path"]>;

export type CreateHref<T extends Function.Narrow<Route[]>> = <
    Path extends FetchPaths<T>,
    QS extends Paths.DynamicOrQueryString<Path>,
    Params extends Paths.Variables<Paths.Pathname<Path>> extends null ? null : Paths.Variables<Paths.Pathname<Path>>,
    QueryStringParsers extends QueryString.ParseURL<Path>
>(
    ...args: Params extends null
        ? QueryString.Has<Path> extends true
            ? [path: Path, qs: QS, parsers?: QueryStringParsers]
            : [path: Path]
        : QueryString.Has<Path> extends true
        ? [path: Path, params: Params, qs: QS, parsers?: QueryStringParsers]
        : [path: Path, params: Params]
) => Params extends null
    ? QueryString.Assign<Path, Function.Narrow<NonNullable<QS>>>
    : QueryString.Assign<Paths.Assign<Path, NonNullable<Params>>, Function.Narrow<NonNullable<QS>>>;

export type Parser = (data: any, key: string) => any;

export type ParsersMap = Map<string, Parser>;

type RouteConfig<Data extends RouteData = {}> = {
    routes: ConfiguredRoute<Data>[];
    navigation: RouterNavigator;
    basename: string;
    history: BrowserHistory;
};

export type AsRouter<T extends readonly Route[], C extends number = 0, Acc extends Router = {}> = C extends T["length"]
    ? Acc
    : AsRouter<
          T,
          Number.Add<C, 1>,
          Acc & {
              [K in T[C]["id"]]: T[C];
          }
      >;


type ReduceConfiguredRoutes<T extends readonly any[], Acc extends readonly Route[] = [], C extends number = 0> = C extends T["length"]
    ? Acc
    : ReduceConfiguredRoutes<T, [...Acc, { regex: RegExp; originalPath: string; id: string } & T[C]], Number.Add<C, 1>>;

export type ConfiguredRoutesAcc<T extends Function.Narrow<Router>> = ReduceConfiguredRoutes<Union.ListOf<Object.UnionOf<T>>>;

export type CreateMappedRoute<_Router extends Function.Narrow<Router>> = {
    navigation: RouterNavigator;
    links: { [Key in keyof _Router]: _Router[Key]["path"] };
    config: Function.Narrow<{ routes: ConfiguredRoutesAcc<_Router> } & Hide<RouteConfig, "routes">>;
    usePaths: <Path extends Paths.Map<_Router>>(
        path: Path
    ) => Paths.Variables<Paths.Pathname<Path>> extends null ? {} : Paths.Variables<Paths.Pathname<Path>>;
    useQueryString: <Path extends Paths.Map<_Router>>(path: Path) => QueryString.Parse<Path>;
    link: <
        Path extends Paths.Map<_Router>,
        QS extends QueryString.Has<Path> extends true ? QueryString.Parse<Path> : Readonly<Paths.Variables<Paths.Pathname<Path>>>,
        Params extends Paths.Variables<Paths.Pathname<Path>> extends null ? null : Readonly<Paths.Variables<Paths.Pathname<Path>>>
    >(
        ...args: Params extends null
            ? QueryString.Has<Path> extends true
                ? readonly [path: Path, qs: Readonly<QS>]
                : readonly [path: Path]
            : QueryString.Has<Path> extends true
            ? readonly [path: Path, params: Readonly<Params>, qs: Readonly<QS>]
            : readonly [path: Path, params: Readonly<Params>]
    ) => Params extends null
        ? QueryString.Assign<Path, NonNullable<QS>>
        : QueryString.Assign<Paths.Assign<Path, NonNullable<Params>>, NonNullable<QS>>;
};
