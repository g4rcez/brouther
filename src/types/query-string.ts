import type { Number, String } from "ts-toolbelt";
import type { QueryStringMapper } from "../utils/mappers";
import { X } from "./x";

export namespace QueryString {
    type Primitive = string | number | null | boolean | Date | Primitive[];

    type AsArray<Type extends string> = Type extends `${infer R}[]` ? R : Type;

    type Undefined<T, IsPartial extends boolean> = IsPartial extends true ? T | undefined : T;

    type Mapper<Type extends string, IsPartial extends boolean> = Type extends keyof Mappers
        ? Undefined<Mappers[Type], IsPartial>
        : Type extends `${keyof Mappers}[]`
        ? Undefined<Mappers[AsArray<Type>][], IsPartial>
        : Undefined<Type, IsPartial>;

    type ExtractPrimitive<T> = T extends string | number | symbol ? T : T extends undefined | null ? "" : any;

    type Pathname<Path extends string> = String.Split<Path, "?">[0];

    type CreateParams<Key extends string, Value extends any[], C extends number = 0, Acc extends string[] = []> = C extends Value["length"]
        ? Acc["length"] extends 0
            ? [`${Key}=${ExtractPrimitive<Value>}`]
            : Acc
        : CreateParams<Key, Value, Number.Add<C, 1>, [...Acc, `${Key}=${Value[C]}`]>;

    type ExtractValues<K extends string, Value> = Value extends any[]
        ? CreateParams<K, Value>
        : Value extends Date
        ? [`${K}=${string}`]
        : Value extends string | number
        ? [`${K}=${Value}`]
        : Value extends undefined | null
        ? [`${K}=`]
        : [`${K}=`];

    type _Replace<
        Path extends string,
        Queries extends readonly string[],
        Values extends Record<string, unknown>,
        C extends number = 0,
        Result extends string[] = []
    > = C extends Queries["length"]
        ? Result["length"] extends 0
            ? Path
            : `${Pathname<Path>}?${String.Join<Result, "&">}`
        : Queries[C] extends `${infer K}=${infer R}`
        ? _Replace<Path, Queries, Values, Number.Add<C, 1>, [...Result, ...ExtractValues<K, Values[K]>]>
        : _Replace<Path, Queries, Values, Number.Add<C, 1>, [...Result, `${string}=${string}`]>;

    export type Mappers = { date: Date; Date: Date; null: null; string: string; number: number; boolean: boolean };

    export type Has<Path extends string> = Only<Path> extends "" ? false : true;

    export type Only<Path extends string> = Path extends `${infer _}?${infer I}` ? I : never;

    export type Remap<Queries extends readonly string[], I extends number = 0, Acc extends {} = {}> = I extends Queries["length"]
        ? Acc
        : (String.Split<Queries[I], "=">[1] extends `${infer Value}!`
              ? {
                    readonly [K in String.Split<Queries[I], "=">[0]]: Mapper<Value, false>;
                }
              : String.Split<Queries[I], "=">[1] extends `${infer Value}`
              ? {
                    readonly [K in String.Split<Queries[I], "=">[0]]?: Mapper<Value, true>;
                }
              : {
                    readonly [K in String.Split<Queries[I], "=">[0]]?: unknown;
                }) &
              Remap<Queries, Number.Add<I, 1>>;

    export type Parse<Query extends string> = Has<Query> extends true ? Remap<String.Split<Only<Query>, "&">> : {};

    export type ParseURL<Path extends string> = Has<Path> extends true ? Partial<QueryStringMapper<keyof Parse<Path>>> : null;

    export type Assign<Path extends string, Query extends {}> = Has<Path> extends true
        ? _Replace<Pathname<Path>, String.Split<Only<Path>, "&">, Query>
        : Path;

    export type Map = Record<string, Primitive>;

    export type SearchParams<T extends {} = {}> = X.Hide<URLSearchParams, "get" | "getAll" | "append" | "set" | "delete"> & {
        readonly append: <K extends keyof T>(name: K, value: string) => void;
        readonly delete: <K extends keyof T>(name: K) => void;
        readonly get: <K extends keyof T>(name: K) => string | null;
        readonly getAll: <K extends keyof T>(name: K) => string[];
        readonly set: <K extends keyof T>(name: K, value: string) => void;
    };
}
