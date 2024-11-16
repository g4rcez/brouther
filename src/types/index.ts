import type React from "react";
import type { Function, Number, Object, Union } from "ts-toolbelt";
import { type CustomResponse } from "../brouther/brouther-response";
import type { RouterNavigator } from "../router/router-navigator";
import { type TextFragment } from "../utils/text-fragment";
import { type BrowserHistory } from "./history";
import type { Paths } from "./paths";
import type { QueryString } from "./query-string";
import { X } from "./x";

export type RouteData = { [k in string]: unknown } | {};

export type Router = Readonly<Record<string, X.Hide<Route, "id">>>;

type RouteArgs<Path extends string, Data extends RouteData> = {
    link: any;
    links: any;
    data: Data;
    path: Path;
    request: Request;
    queryString: QueryString.Parse<Path>;
    paths: X.Coallesce<Paths.Parse<Paths.Pathname<Path>>, {}>;
    event: React.FormEvent<HTMLFormElement> | null;
    form: HTMLFormElement | null;
};

export type Fetcher<Path extends PathFormat, Data extends RouteData> = (
    args: RouteArgs<Path, Data>
) => Promise<CustomResponse<any>> | CustomResponse<any>;

export type HttpMethods = "get" | "post" | "patch" | "put" | "delete";

export type WithoutGet = Exclude<HttpMethods, "get">;

export interface Loader<Path extends PathFormat = PathFormat, Data extends RouteData = RouteData> extends Fetcher<Path, Data> {}

export type Actions<Path extends PathFormat = PathFormat, Data extends RouteData = RouteData> = () => X.Promisify<
    Partial<Record<WithoutGet, Fetcher<Path, Data>>>
>;

export interface Route<Path extends PathFormat = PathFormat, Data extends RouteData = RouteData, ID extends string = string> {
    readonly actions?: Actions<Path, Data>;
    readonly data?: Data;
    readonly element: React.ReactElement;
    readonly loadingElement?: React.ReactElement;
    readonly errorElement?: React.ReactElement;
    readonly id: ID;
    readonly loader?: Loader<Path, Data>;
    readonly path: Path extends undefined ? PathFormat : Path;
}

export type ConfiguredRoute<Path extends PathFormat = PathFormat, Data extends RouteData = RouteData, ID extends string = string> = Route<
    Path,
    Data,
    ID
> & { regex: RegExp; originalPath: string };

export type FetchPaths<Routes extends readonly Route[]> = NonNullable<{ [_ in keyof Routes[number]]: Routes[number]["path"] }["path"]>;

export type CreateHref<T extends readonly Route[]> = <
    const Path extends FetchPaths<T>,
    const Qs extends QueryString.Parse<Path>,
    const Params extends Paths.Parse<Path>,
    const QueryStringParsers extends QueryString.ParseURL<Path>,
    const TextFragments extends TextFragment[],
>(
    ...args: Paths.Has<Path> extends true
        ? QueryString.Has<Path> extends true
            ? QueryString.HasRequired<Path> extends true
                ? readonly [path: Path, params: Params, qs: Qs, parsers?: QueryStringParsers, textFragments?: TextFragments]
                : readonly [path: Path, params: Params, qs?: Qs, parsers?: QueryStringParsers, textFragments?: TextFragments]
            : readonly [path: Path, params: Params, parsers?: QueryStringParsers, textFragments?: TextFragments]
        : QueryString.Has<Path> extends true
          ? QueryString.HasRequired<Path> extends true
              ? readonly [path: Path, qs: Qs, parsers?: QueryStringParsers, textFragments?: TextFragments]
              : readonly [path: Path, qs?: Qs, parsers?: QueryStringParsers, textFragments?: TextFragments]
          : readonly [path: Path]
) => Paths.Parse<Path> extends null
    ? QueryString.Assign<Path, NonNullable<Qs>>
    : QueryString.Assign<Paths.Assign<Path, NonNullable<Params>>, NonNullable<Qs>>;

export type Parser = (data: any, key: string) => any;

export type ParsersMap = Map<string, Parser>;

type RouteConfig = { basename: string; history: BrowserHistory; navigation: RouterNavigator };

export type AsRouter<T extends Function.Narrow<readonly Route[]>, C extends number = 0, Acc extends Router = {}> = C extends T["length"]
    ? Acc
    : AsRouter<T, Number.Add<C, 1>, Acc & { [K in NonNullable<T[C]["id"]>]: T[C] }>;

type ReduceConfiguredRoutes<T extends readonly any[], Acc extends readonly Route[] = [], C extends number = 0> = C extends T["length"]
    ? Acc
    : ReduceConfiguredRoutes<T, [...Acc, T[C] & ConfiguredRoute], Number.Add<C, 1>>;

export type ConfiguredRoutesAcc<T extends Function.Narrow<Readonly<Router>>> = ReduceConfiguredRoutes<Union.ListOf<Object.UnionOf<T>>>;

export type Options = Partial<{ sensitiveCase?: boolean; history: () => BrowserHistory }>;

export type CreateMappedRoute<_Router extends Function.Narrow<Readonly<Router>>> = {
    navigation: RouterNavigator;
    link: CreateHref<Union.ListOf<_Router>>;
    links: { [Key in keyof _Router]: _Router[Key]["path"] };
    config: {
        options: Options;
        router: _Router;
        routes: ConfiguredRoutesAcc<_Router>;
        link: CreateHref<Union.ListOf<_Router>>;
        links: { [Key in keyof _Router]: _Router[Key]["path"] };
    } & RouteConfig;
    useQueryString: <const Path extends Paths.Map<_Router>>(path: Path) => QueryString.Parse<Path>;
    usePaths: <const Path extends Paths.Map<_Router>>(
        path: Path
    ) => Paths.Parse<Paths.Pathname<Path>> extends null ? {} : Paths.Parse<Paths.Pathname<Path>>;
};

export type PathFormat = Readonly<`/${string}`>;

export type Serializable = string | number | null | boolean;

export type AnyJson = { [Key in string]: Serializable | Date | AnyJson | AnyJsonArray };

export type AnyJsonArray = Array<Serializable | Date | AnyJson | AnyJsonArray>;

export type Location = { pathname: string; search: string; hash: string; state: unknown; key: string };

export type InferRouter<_Router extends CreateMappedRoute<any>, Alias extends keyof _Router["links"]> =
    _Router extends CreateMappedRoute<infer Config>
        ? Alias extends keyof Config
            ? {
                  request: Request;
                  links: _Router["config"]["links"];
                  path: _Router["config"]["links"][Alias];
                  link: CreateHref<Union.ListOf<_Router>>;
                  data: Config[Alias]["data"];
                  queryString: QueryString.Parse<Config[Alias]["path"]>;
                  paths: X.Coallesce<Paths.Parse<Paths.Pathname<Config[Alias]["path"]>>, {}>;
              }
            : never
        : never;

export type BroutherFlags = Partial<{ openExternalLinksInNewTab: boolean }>;

export interface LoaderProps<Path extends PathFormat = PathFormat, Data extends RouteData = RouteData> extends RouteArgs<Path, Data> {}

export interface ActionProps<Path extends PathFormat = PathFormat, Data extends RouteData = RouteData> extends RouteArgs<Path, Data> {}
