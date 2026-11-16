import type React from "react";
import type { CustomResponse } from "../brouther/brouther-response";
import type { RouterNavigator } from "../router/router-navigator";
import type { TextFragment } from "../utils/text-fragment";
import type { BrowserHistory } from "./history";
import type { Parser, PathFormat } from "./base";
import type { Paths } from "./paths";
import type { QueryString } from "./query-string";
import type { X } from "./x";

export type { Parser, PathFormat } from "./base";

export type RouteData = Record<string, any>;

type RouterRoute = Omit<Route, "id" | "loader" | "actions"> & {
    readonly loader?: (...args: any[]) => any;
    readonly actions?: (...args: any[]) => any;
};

export type Router = Readonly<Record<string, RouterRoute>>;

type PathArgs<Path extends string> = X.Coalesce<Paths.Parse<Paths.Pathname<Path>>, {}>;

export type RouteOptions<Path extends PathFormat = PathFormat, Data extends RouteData = RouteData> = Omit<
    Route<Path, Data>,
    "id" | "path"
> & {
    readonly id?: string;
};

type RouteArgs<Path extends string, Data extends RouteData> = {
    link: any;
    data: Data;
    links: any;
    path: Path;
    request: Request;
    alreadyRendered: boolean;
    form: HTMLFormElement | null;
    cache: CustomResponse<any> | null;
    queryString: QueryString.Parse<Path>;
    event: React.SubmitEvent<HTMLFormElement> | null;
    cacheStore: Map<string, CustomResponse<any> | null>;
    paths: PathArgs<Path>;
    prev: {
        data: Data;
        path: Path;
        queryString: QueryString.Parse<Path>;
        paths: PathArgs<Path>;
    } | null;
};

export type Fetcher<Path extends PathFormat, Data extends RouteData> = (
    args: RouteArgs<Path, Data>
) => Promise<CustomResponse<any>> | CustomResponse<any>;

export type HttpMethods = "get" | "post" | "patch" | "put" | "delete";

export type WithoutGet = Exclude<HttpMethods, "get">;

export interface Loader<Path extends PathFormat = PathFormat, Data extends RouteData = RouteData> extends Fetcher<
    Path,
    Data
> {}

export type Actions<Path extends PathFormat = PathFormat, Data extends RouteData = RouteData> = () => X.Promisify<
    Partial<Record<WithoutGet, Fetcher<Path, Data>>>
>;

export interface Route<
    Path extends PathFormat = PathFormat,
    Data extends RouteData = RouteData,
    ID extends string = string,
> {
    readonly id: ID;
    readonly data?: Data;
    readonly element: React.ReactElement;
    readonly loader?: Loader<Path, Data>;
    readonly actions?: Actions<Path, Data>;
    readonly loadingElement?: React.ReactElement;
    readonly errorElement?: React.ReactElement<any, any>;
    readonly domains?: readonly string[] | (() => readonly string[]);
    readonly path: Path extends undefined ? PathFormat : Path;
}

export type ConfiguredRoute<
    Path extends PathFormat = PathFormat,
    Data extends RouteData = RouteData,
    ID extends string = string,
> = Route<Path, Data, ID> & { regex: RegExp; originalPath: string };

export type FetchPaths<Routes extends readonly Route[]> = Routes[number]["path"];

type QueryArgs<Path extends string, Qs, QueryStringParsers, TextFragments> =
    QueryString.Has<Path> extends true
        ? QueryString.HasRequired<Path> extends true
            ? readonly [qs: Qs, parsers?: QueryStringParsers, textFragments?: TextFragments]
            : readonly [qs?: Qs, parsers?: QueryStringParsers, textFragments?: TextFragments]
        : readonly [parsers?: QueryStringParsers, textFragments?: TextFragments];

type HrefArgs<Path extends string, Qs, Params, QueryStringParsers, TextFragments> =
    Paths.Has<Path> extends true
        ? readonly [path: Path, params: Params, ...QueryArgs<Path, Qs, QueryStringParsers, TextFragments>]
        : QueryString.Has<Path> extends true
          ? readonly [path: Path, ...QueryArgs<Path, Qs, QueryStringParsers, TextFragments>]
          : readonly [path: Path];

type HrefResult<Path extends string, Qs, Params> =
    Paths.Parse<Path> extends null
        ? QueryString.Assign<Path, NonNullable<Qs>>
        : QueryString.Assign<Paths.Assign<Path, NonNullable<Params>>, NonNullable<Qs>>;

export type CreateHref<T extends readonly Route[]> = <
    const Path extends FetchPaths<T>,
    const Qs extends QueryString.Parse<Path>,
    const Params extends Paths.Parse<Path>,
    const QueryStringParsers extends QueryString.ParseURL<Path>,
    const TextFragments extends TextFragment[],
>(
    ...args: HrefArgs<Path, Qs, Params, QueryStringParsers, TextFragments>
) => HrefResult<Path, Qs, Params>;

export type ParsersMap = Map<string, Parser>;

type RouteConfig = { basename: string; history: BrowserHistory; navigation: RouterNavigator };

type RouteForId<Routes extends Route, ID extends PropertyKey> = Routes extends unknown
    ? ID extends NonNullable<Routes["id"]>
        ? Routes
        : never
    : never;

/** Keep the legacy counter parameter while mapping routes without recursive reduction. */
export type AsRouter<T extends readonly Route[], _C extends number = 0, Acc extends Router = {}> = Acc & {
    [Key in NonNullable<T[number]["id"]>]: RouteForId<T[number], Key>;
};

type RouterRoutes<T extends Router> = readonly (T[keyof T] & Route)[];

export type ConfiguredRoutesAcc<T extends Readonly<Router>> = Array<T[keyof T] & ConfiguredRoute>;

export type Options = {
    sensitiveCase?: boolean;
    history?: () => BrowserHistory;
};

export type CreateMappedRoute<_Router extends Router> = {
    navigation: RouterNavigator;
    link: CreateHref<RouterRoutes<_Router>>;
    links: { [Key in keyof _Router]: _Router[Key]["path"] };
    config: {
        options: Options;
        router: _Router;
        routes: ConfiguredRoutesAcc<_Router>;
        link: CreateHref<RouterRoutes<_Router>>;
        links: { [Key in keyof _Router]: _Router[Key]["path"] };
    } & RouteConfig;
    useQueryString: <const Path extends Paths.Map<_Router>>(path: Path) => QueryString.Parse<Path>;
    usePaths: <const Path extends Paths.Map<_Router>>(
        path: Path
    ) => Paths.Parse<Paths.Pathname<Path>> extends null ? {} : Paths.Parse<Paths.Pathname<Path>>;
};

export type Serializable = string | number | null | boolean;

type AnyJsonValue = Serializable | Date | AnyJson | AnyJsonArray;

export type AnyJson = { [Key in string]: AnyJsonValue };

export type AnyJsonArray = Array<AnyJsonValue>;

export type Location = { pathname: string; search: string; hash: string; state: unknown; key: string };

type MappedRouter = {
    readonly links: object;
    readonly config: {
        readonly links: object;
        readonly link: unknown;
        readonly router: object;
    };
};

type InferRoute<RouterValue, Alias extends PropertyKey> = Alias extends keyof RouterValue ? RouterValue[Alias] : never;

export type InferRouter<
    _Router extends MappedRouter,
    Alias extends keyof _Router["links"],
> = Alias extends keyof _Router["config"]["links"]
    ? InferRoute<_Router["config"]["router"], Alias> extends infer Config extends { readonly path: string }
        ? {
              request: Request;
              links: _Router["config"]["links"];
              path: _Router["config"]["links"][Alias];
              link: _Router["config"]["link"];
              data: Config extends { readonly data?: infer Data } ? Data : never;
              queryString: QueryString.Parse<Config["path"]>;
              paths: X.Coalesce<Paths.Parse<Paths.Pathname<Config["path"]>>, {}>;
          }
        : never
    : never;

export type BroutherFlags = Partial<{ openExternalLinksInNewTab: boolean }>;

export interface LoaderProps<
    Path extends PathFormat = PathFormat,
    Data extends RouteData = RouteData,
> extends RouteArgs<Path, Data> {}

export interface ActionProps<
    Path extends PathFormat = PathFormat,
    Data extends RouteData = RouteData,
> extends RouteArgs<Path, Data> {}
