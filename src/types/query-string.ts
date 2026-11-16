import type { Parser } from "./base";
import type { X } from "./x";

type Pathname<Path extends string> = Path extends `${infer Name}?${string}` ? Name : Path;

type QueryPart<Path extends string> = Path extends `${string}?${infer Query}` ? Query : never;

type PrimitiveValue = string | number | boolean | bigint;

type Stringify<Value> = Value extends PrimitiveValue ? Value : Value extends null | undefined ? "" : string;

type AsArray<Type extends string> = Type extends `${infer Item}[]` ? Item : Type;

type Undefined<Value, IsPartial extends boolean> = IsPartial extends true ? Value | undefined : Value;

type QueryValue<Type extends string, IsPartial extends boolean> = Type extends keyof QueryString.Mappers
    ? Undefined<QueryString.Mappers[Type], IsPartial>
    : Type extends `${keyof QueryString.Mappers}[]`
      ? Undefined<QueryString.Mappers[AsArray<Type>][], IsPartial>
      : Undefined<Type, IsPartial>;

type QueryEntry<Spec extends string> = Spec extends `${infer Key}=${infer Value}`
    ? Value extends `${infer Required}!`
        ? { readonly [K in Key]: QueryValue<Required, false> }
        : { readonly [K in Key]?: QueryValue<Value, true> }
    : { readonly [K in Spec]?: unknown };

type Simplify<Value> = { [Key in keyof Value]: Value[Key] };

type QueryEntries<Queries extends readonly string[]> = Queries[number] extends infer Query
    ? Query extends string
        ? QueryEntry<Query>
        : never
    : never;

type UnionToIntersection<Value> = (Value extends unknown ? (argument: Value) => void : never) extends (
    argument: infer Result
) => void
    ? Result
    : never;

type FromIndex<
    Queries extends readonly string[],
    Index extends number,
    Count extends unknown[] = [],
> = Count["length"] extends Index
    ? Queries
    : Queries extends readonly [string, ...infer Rest extends string[]]
      ? FromIndex<Rest, Index, [...Count, unknown]>
      : [];

type RemapList<Queries extends readonly string[], Result extends {} = {}> = [Queries[number]] extends [never]
    ? Simplify<Result>
    : Simplify<Result & UnionToIntersection<QueryEntries<Queries>>>;

type Append<Current extends string, Next extends string> = Current extends "" ? Next : `${Current}&${Next}`;

type ArrayEntries<
    Key extends string,
    Value extends readonly unknown[],
    Result extends string = "",
> = number extends Value["length"]
    ? `${Key}=${string}`
    : Value extends readonly [infer Head, ...infer Rest extends readonly unknown[]]
      ? ArrayEntries<Key, Rest, Append<Result, `${Key}=${Stringify<Head>}`>>
      : `${Key}=${string}`;

type QueryValueString<Key extends string, Value> = [Value] extends [never]
    ? `${Key}=${string}`
    : Value extends readonly unknown[]
      ? ArrayEntries<Key, Value>
      : Value extends Date
        ? `${Key}=${string}`
        : Value extends string | number
          ? `${Key}=${Value}`
          : Value extends undefined | null
            ? `${Key}=`
            : `${Key}=`;

type ReplaceEntry<Spec extends string, Values extends object> = Spec extends `${infer Key}=${string}`
    ? QueryValueString<Key, Key extends keyof Values ? Values[Key] : never>
    : `${string}=${string}`;

type ReplaceQueries<
    Path extends string,
    Queries extends string,
    Values extends object,
    Result extends string = "",
> = Queries extends `${infer Query}&${infer Rest}`
    ? ReplaceQueries<Path, Rest, Values, Append<Result, ReplaceEntry<Query, Values>>>
    : `${Path}?${Result extends "" ? ReplaceEntry<Queries, Values> : Append<Result, ReplaceEntry<Queries, Values>>}`;

type RemapQuery<Query extends string, Result extends {} = {}> = Query extends `${infer Current}&${infer Rest}`
    ? RemapQuery<Rest, Result & QueryEntry<Current>>
    : Simplify<Result & QueryEntry<Query>>;

export namespace QueryString {
    export type Mappers = {
        date: Date;
        Date: Date;
        null: null;
        string: string;
        number: number;
        boolean: boolean;
    };

    export type Has<Path extends string> = QueryPart<Path> extends "" | never ? false : true;

    export type HasMandatory<Path extends string> =
        Has<Path> extends true ? (QueryPart<Path> extends `${string}!${string}` ? true : false) : false;

    export type Only<Path extends string> = QueryPart<Path>;

    /** Parse the query declaration into an object type. */
    export type Remap<Queries extends readonly string[], I extends number = 0, Acc extends {} = {}> = RemapList<
        FromIndex<Queries, I>,
        Acc
    >;

    export type Parse<Query extends string> = Has<Query> extends true ? RemapQuery<Only<Query>> : {};

    export type ParseURL<Path extends string> =
        Has<Path> extends true ? Partial<QueryStringMapper<keyof Parse<Path>>> : null;

    export type Assign<Path extends string, Query extends {}> =
        Has<Path> extends true
            ? ReplaceQueries<Pathname<Path>, Only<Path>, Query> extends infer Result extends string
                ? Result
                : never
            : Path;

    /** Values accepted by query-string helpers. */
    export type Map = Record<string, PrimitiveValue | null | Date | object>;

    export type SearchParams<T extends {} = {}> = X.Hide<
        URLSearchParams,
        "get" | "getAll" | "append" | "set" | "delete"
    > & {
        readonly append: <K extends keyof T>(name: K, value: string) => void;
        readonly delete: <K extends keyof T>(name: K) => void;
        readonly get: <K extends keyof T>(name: K) => string | null;
        readonly getAll: <K extends keyof T>(name: K) => string[];
        readonly set: <K extends keyof T>(name: K, value: string) => void;
    };

    export type HasRequired<Path extends string> =
        Has<Path> extends true ? (QueryPart<Path> extends `${string}!` ? true : false) : false;
}

export type QueryStringMapper<T extends PropertyKey = keyof QueryString.Mappers> = Record<T, Parser>;
