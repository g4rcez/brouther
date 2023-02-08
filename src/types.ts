import type React from "react";
import type { Function, Number, Object, String, Union } from "ts-toolbelt";
import type { RouterNavigator } from "./router-navigator";
import type { QueryStringMapper } from "./mappers";
import type { createBrowserHistory } from "history";

export type Nullable<T> = T | null;

export type Hide<T, K extends keyof T> = Omit<T, K>;

export type QueryStringPrimitive = string | number | null | boolean | Date | QueryStringPrimitive[];

export type ConfiguredRoute = Route & { regex: RegExp; originalPath: string };

export type Router = Record<string, Hide<Route, "id">>;

export type Route = {
    id: Readonly<string>;
    path: Readonly<string>;
    element: React.ReactElement;
};

export type QueryStringMappers = {
    string: string;
    number: number;
    boolean: boolean;
    date: Date;
    null: null;
};

export type FetchPaths<Routes extends Function.Narrow<Route[]>> = NonNullable<{ [_ in keyof Routes[number]]: Routes[number]["path"] }["path"]>;

export type UrlParams<T extends string> = string extends T
    ? Record<string, string>
    : T extends `${infer _}:${infer Param}/${infer Rest}`
    ? { [k in Param | keyof UrlParams<Rest>]: string }
    : T extends `${infer _}:${infer Param}`
    ? { [k in Param]: string }
    : null;

export type QueryStringExists<Path extends Function.Narrow<string>> = Path extends `${string}?${string}` ? true : false;

export type AsArray<Type extends string> = Type extends `${infer R}[]` ? R : Type;

export type Mapper<Type extends string> = Type extends keyof QueryStringMappers
    ? QueryStringMappers[Type]
    : Type extends `${keyof QueryStringMappers}[]`
    ? QueryStringMappers[AsArray<Type>][]
    : Type;

export type OnlyQ<Path extends string> = Path extends `${infer _}?${infer I}` ? I : never;

export type RemapQueryString<Queries extends readonly string[], I extends number = 0> = I extends Queries["length"]
    ? {}
    : (String.Split<Queries[I], "=">[1] extends `${infer Value}!`
          ? {
                [K in String.Split<Queries[I], "=">[0]]: Mapper<Value>;
            }
          : {
                [K in String.Split<Queries[I], "=">[0]]: Mapper<String.Split<Queries[I], "=">[1]>;
            }) &
          RemapQueryString<Queries, Number.Add<I, 1>>;

export type HasQueryString<Path extends string> = OnlyQ<Path> extends "" ? false : true;

export type QueryString<Query extends string> = HasQueryString<Query> extends true ? RemapQueryString<String.Split<OnlyQ<Query>, "&">> : {};

export type QueryStringRecord = Record<string, QueryStringPrimitive>;

export type Pathname<Path extends string> = String.Split<Path, "?">[0];

export type PathsMap<_Router extends Function.Narrow<Router>> = NonNullable<{ [_ in keyof _Router[string]]: _Router[string]["path"] }["path"]>;

type __TypeLinkSecondParam<Path extends string> = UrlParams<Pathname<Path>> extends null
    ? HasQueryString<Path> extends true
        ? QueryString<Path>
        : UrlParams<Pathname<Path>>
    : QueryString<Path>;

type QueryStringLinkParsers<Path extends string> = HasQueryString<Path> extends true ? Partial<QueryStringMapper<keyof QueryString<Path>>> : null;

export type CreateHref<T extends Function.Narrow<Route[]>> = <
    Path extends FetchPaths<T>,
    QS extends __TypeLinkSecondParam<Path>,
    Params extends UrlParams<Pathname<Path>> extends null ? null : UrlParams<Pathname<Path>>,
    QueryStringParsers extends QueryStringLinkParsers<Path>
>(
    ...args: Params extends null
        ? HasQueryString<Path> extends true
            ? [path: Path, qs: QS, parsers?: QueryStringParsers]
            : [path: Path]
        : HasQueryString<Path> extends true
        ? [path: Path, params: Params, qs: QS, parsers?: QueryStringParsers]
        : [path: Path, params: Params]
) => Params extends null
    ? ReplaceQueryString<Path, Function.Narrow<NonNullable<QS>>>
    : ReplaceQueryString<ReplaceParams<Path, NonNullable<Params>>, Function.Narrow<NonNullable<QS>>>;

export type ToArray<Dict extends Function.Narrow<Record<string, string>>> = Union.ListOf<
    Object.UnionOf<{ [Key in keyof Dict]: [Key, Readonly<Dict[Key]>] }>
>;

export type ReplaceParams<Path extends string, Params extends {}, I extends number = 0> = I extends ToArray<Params>["length"]
    ? Path
    : ReplaceParams<String.Replace<Path, `:${ToArray<Params>[I][0]}`, ToArray<Params>[I][1]>, Params, Number.Add<I, 1>>;

type ExtractPrimitive<T> = T extends string | number | symbol ? T : T extends undefined | null ? "" : any;

type BuildQueryStringParam<Key extends string, Value extends any[], C extends number = 0, Acc extends string[] = []> = C extends Value["length"]
    ? Acc["length"] extends 0
        ? [`${Key}=${ExtractPrimitive<Value>}`]
        : Acc
    : BuildQueryStringParam<Key, Value, Number.Add<C, 1>, [...Acc, `${Key}=${Value[C]}`]>;

type ExtractQueryStringValue<K extends string, Value> = Value extends any[]
    ? BuildQueryStringParam<K, Value>
    : Value extends Date
    ? [`${K}=${string}`]
    : Value extends string | number
    ? [`${K}=${Value}`]
    : Value extends undefined | null
    ? [`${K}=`]
    : [`${K}=`];

type ReplaceQSValues<
    Path extends string,
    Queries extends readonly string[],
    Values extends Record<string, unknown>,
    C extends number = 0,
    Result extends string[] = []
> = C extends Queries["length"]
    ? Result["length"] extends 0
        ? Path
        : `${String.Split<Path, "?">[0]}?${String.Join<Result, "&">}`
    : Queries[C] extends `${infer K}=${infer R}`
    ? ReplaceQSValues<Path, Queries, Values, Number.Add<C, 1>, [...Result, ...ExtractQueryStringValue<K, Values[K]>]>
    : ReplaceQSValues<Path, Queries, Values, Number.Add<C, 1>, [...Result, `${string}=${string}`]>;

export type ReplaceQueryString<Path extends string, Query extends {}> = HasQueryString<Path> extends true
    ? ReplaceQSValues<String.Split<Path, "?">[0], String.Split<OnlyQ<Path>, "&">, Query>
    : Path;

export type Parser = (data: any, key: string) => any;

export type ParsersMap = Map<string, Parser>;

export type CommonRoute = {
    navigation: RouterNavigator;
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

export type CreateMappedRoute<_Router extends Function.Narrow<Router>> = CommonRoute & {
    config: { routes: ConfiguredRoute[]; basename: string; history: BrowserHistory };
    links: { [Key in keyof _Router]: _Router[Key]["path"] };
    usePaths: <Path extends PathsMap<_Router>>(path: Path) => UrlParams<Pathname<Path>> extends null ? {} : UrlParams<Pathname<Path>>;
    useQueryString: <Path extends PathsMap<_Router>>(path: Path) => QueryString<Path>;
    link: <
        Path extends PathsMap<_Router>,
        QS extends HasQueryString<Path> extends true ? QueryString<Path> : Readonly<UrlParams<Pathname<Path>>>,
        Params extends UrlParams<Pathname<Path>> extends null ? null : Readonly<UrlParams<Pathname<Path>>>
    >(
        ...args: Params extends null ? readonly [path: Path, qs: QS] : readonly [path: Path, params: Readonly<Params>, qs: Readonly<QS>]
    ) => Params extends null
        ? ReplaceQueryString<Path, NonNullable<QS>>
        : ReplaceQueryString<ReplaceParams<Path, NonNullable<Params>>, NonNullable<QS>>;
};

type BrowserHistory = ReturnType<typeof createBrowserHistory>;
