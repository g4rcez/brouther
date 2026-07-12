import type { Function, Number, Object, String, Union } from "ts-toolbelt";
import type { Router } from "./index";
import type { QueryString } from "./query-string";

type RecordMap = Record<string, string>;

export namespace Paths {
    type ToArray<Dict extends Function.Narrow<RecordMap>> = Union.ListOf<
        Object.UnionOf<{ [Key in keyof Dict]: [Key, Readonly<Dict[Key]>] }>
    >;

    export type Pathname<Path extends string> = String.Split<Path, "?">[0];

    type Merge<T> = { [K in keyof T]: T[K] } & {};

    type Dict = {
        Date: Date;
        string: string;
        number: number;
        boolean: boolean;
    };

    type Mapper<T extends string> = T extends keyof Dict ? Dict[T] : string;

    type ExtractParam<T extends string> = T extends `<${infer R}`
        ? R extends `${infer X}>`
            ? X
            : null
        : T extends `:${infer ID}`
          ? `${ID}:string`
          : null;

    type AddParam<T extends string, Acc extends {}> =
        ExtractParam<T> extends infer Param extends string
            ? Acc & { [K in String.Split<Param, ":">[0]]: Mapper<String.Split<Param, ":">[1]> }
            : Acc;

    type ParsePath<T extends string, Acc extends {} = {}> = T extends `${infer Segment}/${infer Rest}`
        ? ParsePath<Rest, AddParam<Segment, Acc>>
        : AddParam<T, Acc> extends infer Result extends {}
          ? keyof Result extends never
              ? null
              : Merge<Result>
          : never;

    export type Parse<T extends string> = ParsePath<Pathname<T>>;

    export type Map<_Router extends Function.Narrow<Router>> = NonNullable<
        { [_ in keyof _Router[string]]: _Router[string]["path"] }["path"]
    >;

    export type PathsQs<Path extends string> =
        Parse<Pathname<Path>> extends null
            ? QueryString.Has<Path> extends true
                ? QueryString.Parse<Path>
                : Parse<Pathname<Path>>
            : QueryString.Parse<Path>;

    export type Assign<
        Path extends string,
        Params extends {},
        I extends number = 0,
    > = I extends ToArray<Params>["length"]
        ? Path
        : Assign<
              Path extends `${infer _}<${ToArray<Params>[I][0]}:${infer R}>${infer __}`
                  ? String.Replace<Path, `<${ToArray<Params>[I][0]}:${R}>`, `${ToArray<Params>[I][1]}`>
                  : String.Replace<Path, `:${ToArray<Params>[I][0]}`, `${ToArray<Params>[I][1]}`>,
              Params,
              Number.Add<I, 1>
          >;

    export type Has<T extends string> = T extends `${string}/:${string}`
        ? true
        : T extends `${string}<${infer _}:${infer __}>${string}`
          ? true
          : false;
}
