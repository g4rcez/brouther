import React from "react";
import { Narrow } from "ts-toolbelt/out/Function/Narrow";
import type { N, List, O, S, Union } from "ts-toolbelt";
import { Split } from "ts-toolbelt/out/String/Split";
import { Add } from "ts-toolbelt/out/Number/Add";
import { createRouter } from "./router";
import { RouterNavigator } from "./router-navigator";
import { Join } from "ts-toolbelt/out/String/Join";
import { Any } from "ts-toolbelt";

export type QueryStringMappers = {
    string: string;
    number: number;
    boolean: boolean;
    date: Date;
    null: null;
};

export type Route = {
    id: Readonly<string>;
    path: Readonly<string>;
    element: React.ReactElement;
};

export type ExtractPaths<T extends Narrow<Route[]>> = NonNullable<{ [K in keyof T[number]]: T[number]["path"] }["path"]>;

export type UrlParams<T extends string> = string extends T
    ? Record<string, string>
    : T extends `${infer _}:${infer Param}/${infer Rest}`
    ? { [k in Param | keyof UrlParams<Rest>]: string }
    : T extends `${infer _}:${infer Param}`
    ? { [k in Param]: string }
    : null;

export type QueryStringExists<S extends Narrow<string>> = S extends `${string}?${string}` ? true : false;

export type AsArray<S extends string> = S extends `${infer R}[]` ? R : S;

export type Mapper<S extends string> = S extends keyof QueryStringMappers
    ? QueryStringMappers[S]
    : S extends `${keyof QueryStringMappers}[]`
    ? QueryStringMappers[AsArray<S>][]
    : S;

export type OnlyQ<S extends string> = S extends `${infer _}?${infer I}` ? I : never;

export type Dissemble<Queries extends readonly string[], C extends number = 0> = C extends Queries["length"]
    ? {}
    : (Split<Queries[C], "=">[1] extends `${infer Value}!`
          ? {
                [K in Split<Queries[C], "=">[0]]: Mapper<Value>;
            }
          : {
                [K in Split<Queries[C], "=">[0]]: Mapper<Split<Queries[C], "=">[1]>;
            }) &
          Dissemble<Queries, Add<C, 1>>;

export type HasQueryString<S extends string> = OnlyQ<S> extends "" ? false : true;

export type QueryString<S extends string> = HasQueryString<S> extends false ? {} : Dissemble<Split<OnlyQ<S>, "&">>;

export type QueryStringPrimitive = string | number | null | boolean | QueryStringPrimitive[];

export type QueryStringRecord = Record<string, QueryStringPrimitive>;

export type ExtractPathname<S extends string> = Split<S, "?">[0];

export type Nullable<T> = T | null;

export type ConfiguredRoute = Route & { regex: RegExp; originalPath: string };

export type Hide<T, K extends keyof T> = Omit<T, K>;

export type Router = Record<string, Hide<Route, "id">>;

export type ExtractDictPath<T extends Narrow<Router>> = NonNullable<{ [K in keyof T[string]]: T[string]["path"] }["path"]>;

export type CreateMappedRoute<T extends Narrow<Router>> = {
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

export type ToArray<K extends Record<string, string>> = Union.ListOf<O.UnionOf<{ [k in keyof K]: [k, K[k]] }>>;

export type ReplaceParams<T extends string, P extends {}, C extends number = 0> = C extends ToArray<P>["length"]
    ? T
    : ReplaceParams<S.Replace<T, `:${ToArray<P>[C][0]}`, ToArray<P>[C][1]>, P, N.Add<C, 1>>;

type Reduce<K extends string, V extends any[], C extends number = 0, Acc extends string[] = []> = C extends V["length"]
    ? S.Join<Acc, "_">
    : Reduce<K, V, Add<C, 1>, [...Acc, `${K}=___${V[C]}`]>;

type ExtractPrimitive<T> = T extends Date | any[] ? any : T;

type BuildQueryStringParam<K extends string, Value extends any[], C extends number = 0, Acc extends string[] = []> = C extends Value["length"]
    ? Acc["length"] extends 0
        ? [`${K}=${ExtractPrimitive<Value>}`]
        : Acc
    : BuildQueryStringParam<K, Value, Add<C, 1>, [...Acc, `${K}=${Value[C]}`]>;

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
        : `${S.Split<Path, "?">[0]}?${S.Join<Result, "&">}`
    : Queries[C] extends `${infer K}=${infer R}`
    ? $Replace<Path, Queries, Values, Add<C, 1>, [...Result, ...ExtractQueryStringValue<K, Values[K]>]>
    : $Replace<Path, Queries, Values, Add<C, 1>, [...Result, `KOE=ppp`]>;

export type ExtractQSValues<Path extends string, Query extends {}> = HasQueryString<Path> extends true
    ? $Replace<S.Split<Path, "?">[0], S.Split<OnlyQ<Path>, "&">, Query>
    : Path;
