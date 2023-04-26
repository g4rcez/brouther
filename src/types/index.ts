import type React from "react";
import type { Function, Number, Object, Union } from "ts-toolbelt";
import type { RouterNavigator } from "../router/router-navigator";
import type { QueryString } from "./query-string";
import type { Paths } from "./paths";
import { BrowserHistory } from "./history";
import { X } from "./x";

export type RouteData = Record<string, unknown> | unknown;

export type Router = Readonly<Record<string, X.Hide<Route, "id">>>;

type RouteArgs<Path extends string, Data extends RouteData> = {
    data: Data;
    path: string;
    request: Request;
    queryString: QueryString.Parse<Path>;
    paths: X.Coallesce<Paths.Variables<Paths.Pathname<Path>>, {}>;
};

type BroutherResponse = Response | Promise<Response>;

export type Fetcher<Path extends PathFormat, Data extends RouteData> = (args: RouteArgs<Path, Data>) => Promise<BroutherResponse> | BroutherResponse;

export type HttpMethods = "get" | "post" | "patch" | "put" | "delete";

export type WithoutGet = Exclude<HttpMethods, "get">;

export type Loader<Path extends PathFormat = PathFormat, Data extends RouteData = RouteData> = Fetcher<Path, Data>;

export type Actions<Path extends PathFormat = PathFormat, Data extends RouteData = RouteData> = () => X.Promisify<
    Partial<Record<WithoutGet, Fetcher<Path, Data>>>
>;

export type Route<Path extends PathFormat = PathFormat, Data extends RouteData = RouteData, ID extends string = string> = Readonly<{
    data?: Data;
    id: ID;
    element: React.ReactElement;
    loader?: Loader<Path, Data>;
    actions?: Actions<Path, Data>;
    path: Path extends undefined ? string : Path;
}>;

export type ConfiguredRoute<Data extends RouteData = {}> = Route & {
    regex: RegExp;
    originalPath: string;
};

export type FetchPaths<Routes extends readonly Route[]> = NonNullable<{ [_ in keyof Routes[number]]: Routes[number]["path"] }["path"]>;

export type CreateHref<T extends readonly Route[]> = <
    const Path extends FetchPaths<T>,
    const Qs extends Function.Narrow<Readonly<Paths.DynamicOrQueryString<Path>>>,
    const Params extends Paths.Variables<Paths.Pathname<Path>> extends null ? null : Function.Narrow<Readonly<Paths.Variables<Paths.Pathname<Path>>>>,
    const QueryStringParsers extends QueryString.ParseURL<Path>
>(
    ...args: Params extends null
        ? QueryString.Has<Path> extends true
            ? X.AtLeastOne<Qs> extends true
                ? readonly [path: Path, qs: Qs, parsers?: QueryStringParsers]
                : readonly [path: Path, qs?: Qs, parsers?: QueryStringParsers]
            : readonly [path: Path]
        : QueryString.Has<Path> extends true
        ? X.AtLeastOne<Qs> extends true
            ? readonly [path: Path, params: Params, qs: Qs, parsers?: QueryStringParsers]
            : readonly [path: Path, params: Params, qs?: Qs, parsers?: QueryStringParsers]
        : readonly [path: Path, params: Params]
) => Params extends null
    ? QueryString.Assign<Path, NonNullable<Qs>>
    : QueryString.Assign<Paths.Assign<Path, NonNullable<Params>>, Function.Narrow<NonNullable<Qs>>>;

export type Parser = (data: any, key: string) => any;

export type ParsersMap = Map<string, Parser>;

type RouteConfig<Data extends RouteData = {}> = {
    routes: ConfiguredRoute<Data>[];
    navigation: RouterNavigator;
    basename: string;
    history: BrowserHistory;
};

export type AsRouter<T extends Function.Narrow<readonly Route[]>, C extends number = 0, Acc extends Router = {}> = C extends T["length"]
    ? Acc
    : AsRouter<T, Number.Add<C, 1>, Acc & { [K in NonNullable<T[C]["id"]>]: T[C] }>;

type ReduceConfiguredRoutes<T extends readonly any[], Acc extends readonly Route[] = [], C extends number = 0> = C extends T["length"]
    ? Acc
    : ReduceConfiguredRoutes<T, [...Acc, { regex: RegExp; originalPath: string; id: string } & T[C]], Number.Add<C, 1>>;

export type ConfiguredRoutesAcc<T extends Function.Narrow<Router>> = ReduceConfiguredRoutes<Union.ListOf<Object.UnionOf<T>>>;

export type CreateMappedRoute<_Router extends Function.Narrow<Router>> = {
    navigation: RouterNavigator;
    links: { [Key in keyof _Router]: _Router[Key]["path"] };
    config: { routes: ConfiguredRoutesAcc<_Router> } & X.Hide<RouteConfig, "routes">;
    usePaths: <Path extends Paths.Map<_Router>>(
        path: Path
    ) => Paths.Variables<Paths.Pathname<Path>> extends null ? {} : Paths.Variables<Paths.Pathname<Path>>;
    useQueryString: <Path extends Paths.Map<_Router>>(path: Path) => QueryString.Parse<Path>;
    link: CreateHref<Union.ListOf<_Router>>;
};

export type PathFormat = Readonly<`/${string}`>;

type Serializable = string | number | null | boolean;

export type AnyJson = { [Key in string]: Serializable | Date | AnyJson | AnyJsonArray };

export type AnyJsonArray = Array<Serializable | Date | AnyJson | AnyJsonArray>;
