import type { Function, Number, Object, String, Union } from "ts-toolbelt";
import type { QueryString } from "./query-string";
import type { Router } from "./index";

type RecordMap = Record<string, string>;

export namespace Paths {
  type ToArray<Dict extends Function.Narrow<RecordMap>> = Union.ListOf<Object.UnionOf<{ [Key in keyof Dict]: [Key, Readonly<Dict[Key]>] }>>;

  export type Assign<Path extends string, Params extends {}, I extends number = 0> = I extends ToArray<Params>["length"]
    ? Path
    : Assign<String.Replace<Path, `:${ToArray<Params>[I][0]}`, ToArray<Params>[I][1]>, Params, Number.Add<I, 1>>;

  export type Variables<T extends string> = string extends T
    ? RecordMap
    : T extends `${infer _}:${infer Param}/${infer Rest}`
      ? { [k in Param | keyof Variables<Rest>]: string }
      : T extends `${infer _}:${infer Param}`
        ? { [k in Param]: string }
        : null;

  export type Pathname<Path extends string> = String.Split<Path, "?">[0];

  export type Map<_Router extends Function.Narrow<Router>> = NonNullable<{ [_ in keyof _Router[string]]: _Router[string]["path"] }["path"]>;

  export type DynamicOrQueryString<Path extends string> = Variables<Pathname<Path>> extends null
    ? QueryString.Has<Path> extends true
      ? QueryString.Parse<Path>
      : Variables<Pathname<Path>>
    : QueryString.Parse<Path>;
}
