import type { Number, String, Union } from "ts-toolbelt";
import type { QueryStringMapper } from "../mappers";
import type { Hide } from "./index";

export namespace QueryString {
    type Primitive = string | number | null | boolean | Date | Primitive[];

    type AsArray<Type extends string> = Type extends `${infer R}[]` ? R : Type;

    type Mapper<Type extends string> = Type extends keyof Mappers
        ? Mappers[Type]
        : Type extends `${keyof Mappers}[]`
        ? Mappers[AsArray<Type>][]
        : Type;

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

    export type Mappers = {
        date: Date;
        null: null;
        string: string;
        number: number;
        boolean: boolean;
    };

    export type Has<Path extends string> = Only<Path> extends "" ? false : true;

    export type Only<Path extends string> = Path extends `${infer _}?${infer I}` ? I : never;

    export type Remap<Queries extends readonly string[], I extends number = 0> = I extends Queries["length"]
        ? {}
        : (String.Split<Queries[I], "=">[1] extends `${infer Value}!`
              ? {
                    [K in String.Split<Queries[I], "=">[0]]: Mapper<Value>;
                }
              : {
                    [K in String.Split<Queries[I], "=">[0]]: Mapper<String.Split<Queries[I], "=">[1]>;
                }) &
              Remap<Queries, Number.Add<I, 1>>;

    export type Parse<Query extends string> = Has<Query> extends true ? Union.Merge<Remap<String.Split<Only<Query>, "&">>> : {};

    export type ParseURL<Path extends string> = Has<Path> extends true ? Partial<QueryStringMapper<keyof Parse<Path>>> : null;

    export type Assign<Path extends string, Query extends {}> = Has<Path> extends true
        ? _Replace<Pathname<Path>, String.Split<Only<Path>, "&">, Query>
        : Path;

    export type Map = Record<string, Primitive>;

    export type SearchParams<T extends {} = {}> = Hide<URLSearchParams, "get" | "getAll" | "append" | "set" | "delete"> & {
        readonly get: <K extends keyof T>(name: K) => string | null;
        readonly getAll: <K extends keyof T>(name: K) => string[];
        readonly append: <K extends keyof T>(name: K, value: string) => void;
        readonly set: <K extends keyof T>(name: K, value: string) => void;
        readonly delete: <K extends keyof T>(name: K) => void;
    };
}
