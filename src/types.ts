import React from "react";
import { Narrow } from "ts-toolbelt/out/Function/Narrow";
import { Split } from "ts-toolbelt/out/String/Split";
import { Add } from "ts-toolbelt/out/Number/Add";
import { createRouter } from "./router";

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

export type Dissemble<A extends readonly string[], C extends number = 0> = C extends A["length"]
    ? {}
    : (Split<A[C], "=">[1] extends `${infer Value}!`
          ? {
                [K in Split<A[C], "=">[0]]: Mapper<Value>;
            }
          : {
                [K in Split<A[C], "=">[0]]?: Mapper<NonNullable<Split<A[C], "=">[1]>>;
            }) &
          Dissemble<A, Add<C, 1>>;

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

export type RouterNavigator = {
    back: () => void;
    forward: () => void;
    go: (jumps: number) => void;
    push: (path: string) => void;
    replace: (path: string) => void;
};

export type CreateMappedRoute<T extends Narrow<Router>> = {
    navigator: RouterNavigator;
    config: ReturnType<typeof createRouter<[]>>;
    links: { [K in keyof T]: T[K]["path"] };
    usePaths: <Path extends ExtractDictPath<T>>(path: Path) => UrlParams<ExtractPathname<Path>>;
    useQueryString: <Path extends ExtractDictPath<T>>(path: Path) => QueryString<Path>;
    link: <
        Path extends ExtractDictPath<T>,
        QS extends HasQueryString<Path> extends true ? QueryString<Path> : UrlParams<ExtractPathname<Path>>,
        Params extends UrlParams<ExtractPathname<Path>> extends null ? null : UrlParams<ExtractPathname<Path>>
    >(
        ...args: Params extends null ? [path: Path, qs: QS] : [path: Path, params: Params, qs: QS]
    ) => string;
};
