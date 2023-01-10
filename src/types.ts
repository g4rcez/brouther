import React from "react";
import { Narrow } from "ts-toolbelt/out/Function/Narrow";
import { Split } from "ts-toolbelt/out/String/Split";
import { Add } from "ts-toolbelt/out/Number/Add";

export type Map = {
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

export type Mapper<S extends string> = S extends keyof Map ? Map[S] : S extends `${keyof Map}[]` ? Map[AsArray<S>][] : S;

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

export type QueryString<S extends string> = Split<OnlyQ<S>, "&"> extends "" ? {} : Dissemble<Split<OnlyQ<S>, "&">>;

export type QueryStringPrimitive = string | number | null | boolean | QueryStringPrimitive[];

export type QueryStringRecord = Record<string, QueryStringPrimitive>;

export type ExtractPathname<S extends string> = Split<S, "?">[0];

export type Nullable<T> = T | null;

export type ConfiguredRoute = Route & { regex: RegExp; originalPath: string };
