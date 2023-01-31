import React from "react";
import type { Number, Function, Object, String, Union } from "ts-toolbelt";
import { createRouter } from "./router";
import { RouterNavigator } from "./router-navigator";

export type Nullable<T> = T | null;

export type Hide<T, K extends keyof T> = Omit<T, K>;

export type QueryStringPrimitive = string | number | null | boolean | QueryStringPrimitive[];

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

export type ExtractPaths<T extends Function.Narrow<Route[]>> = NonNullable<{ [K in keyof T[number]]: T[number]["path"] }["path"]>;

export type UrlParams<T extends string> = string extends T
    ? Record<string, string>
    : T extends `${infer _}:${infer Param}/${infer Rest}`
    ? { [k in Param | keyof UrlParams<Rest>]: string }
    : T extends `${infer _}:${infer Param}`
    ? { [k in Param]: string }
    : null;

export type QueryStringExists<Path extends Function.Narrow<string>> = Path extends `${string}?${string}` ? true : false;

export type AsArray<Type extends string> = Type extends `${infer R}[]` ? R : Type;

export type Mapper<S extends string> = S extends keyof QueryStringMappers
    ? QueryStringMappers[S]
    : S extends `${keyof QueryStringMappers}[]`
    ? QueryStringMappers[AsArray<S>][]
    : S;

export type OnlyQ<Path extends string> = Path extends `${infer _}?${infer I}` ? I : never;

export type Dissemble<Queries extends readonly string[], C extends number = 0> = C extends Queries["length"]
    ? {}
    : (String.Split<Queries[C], "=">[1] extends `${infer Value}!`
          ? {
                [K in String.Split<Queries[C], "=">[0]]: Mapper<Value>;
            }
          : {
                [K in String.Split<Queries[C], "=">[0]]: Mapper<String.Split<Queries[C], "=">[1]>;
            }) &
          Dissemble<Queries, Number.Add<C, 1>>;

export type HasQueryString<Path extends string> = OnlyQ<Path> extends "" ? false : true;

export type QueryString<Query extends string> = HasQueryString<Query> extends false ? {} : Dissemble<String.Split<OnlyQ<Query>, "&">>;

export type QueryStringRecord = Record<string, QueryStringPrimitive>;

export type ExtractPathname<Path extends string> = String.Split<Path, "?">[0];

export type ConfiguredRoute = Route & { regex: RegExp; originalPath: string };

export type Router = Record<string, Hide<Route, "id">>;

export type ExtractDictPath<T extends Function.Narrow<Router>> = NonNullable<{ [K in keyof T[string]]: T[string]["path"] }["path"]>;

export type CreateMappedRoute<T extends Function.Narrow<Router>> = {
    navigator: RouterNavigator;
    config: ReturnType<typeof createRouter<[]>>["config"];
    links: { [K in keyof T]: T[K]["path"] };
    usePaths: <Path extends ExtractDictPath<T>>(path: Path) => UrlParams<ExtractPathname<Path>>;
    useQueryString: <Path extends ExtractDictPath<T>>(path: Path) => QueryString<Path>;
    link: <
        Path extends ExtractDictPath<T>,
        QS extends HasQueryString<Path> extends true ? QueryString<Path> : UrlParams<ExtractPathname<Path>>,
        Params extends UrlParams<ExtractPathname<Path>> extends null ? null : UrlParams<ExtractPathname<Path>>
    >(
        ...args: Params extends null ? [path: Path, qs: QS] : [path: Path, params: Params, qs: QS]
    ) => Params extends null ? Path : ExtractQSValues<ReplaceParams<Path, NonNullable<Params>>, NonNullable<QS>>;
};

export type ToArray<K extends Record<string, string>> = Union.ListOf<Object.UnionOf<{ [k in keyof K]: [k, K[k]] }>>;

export type ReplaceParams<Path extends string, Params extends {}, I extends number = 0> = I extends ToArray<Params>["length"]
    ? Path
    : ReplaceParams<String.Replace<Path, `:${ToArray<Params>[I][0]}`, ToArray<Params>[I][1]>, Params, Number.Add<I, 1>>;

type Reduce<Key extends string, Value extends any[], I extends number = 0, Acc extends string[] = []> = I extends Value["length"]
    ? String.Join<Acc, "_">
    : Reduce<Key, Value, Number.Add<I, 1>, [...Acc, `${Key}=___${Value[I]}`]>;

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

type $Replace<
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
    ? $Replace<Path, Queries, Values, Number.Add<C, 1>, [...Result, ...ExtractQueryStringValue<K, Values[K]>]>
    : $Replace<Path, Queries, Values, Number.Add<C, 1>, [...Result, `KOE=ppp`]>;

export type ExtractQSValues<Path extends string, Query extends {}> = HasQueryString<Path> extends true
    ? $Replace<String.Split<Path, "?">[0], String.Split<OnlyQ<Path>, "&">, Query>
    : Path;
