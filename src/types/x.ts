import type { List, Union, Number, Object } from "ts-toolbelt";

export namespace X {
    export type Nullable<T> = T | null;

    export type Hide<T, K extends keyof T> = Omit<T, K>;

    export type Coallesce<T, Defaults = T> = T extends null ? Defaults : NonNullable<T>;

    export type AnyString<T extends string | number | symbol> = T | Omit<string, T>;

    export type Promisify<T> = T | Promise<T>;

    export type ReduceKeys<T extends {}, Keys extends List.List, C extends number = 0> = Keys["length"] extends C
      ? false
      : T[Keys[C]] extends T[Keys[C]] | undefined
        ? Object.UnionOf<Keys[C]> extends (undefined|Object.UnionOf<Keys[C]>) ? true : false
        : ReduceKeys<T, Keys, Number.Add<C, 1>>;

    export type AtLeastOne<T extends {} | null> = T extends null ? false : ReduceKeys<NonNullable<T>, Union.ListOf<T>>;

}
