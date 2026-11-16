export namespace X {
    export type Nullable<T> = T | null;

    export type Hide<T, K extends keyof T> = Omit<T, K>;

    export type Coalesce<T, Defaults = T> = T extends null ? Defaults : NonNullable<T>;

    /** @deprecated Use `Coalesce` instead. */
    export type Coallesce<T, Defaults = T> = Coalesce<T, Defaults>;

    export type AnyString<T extends string | number | symbol> = T | Omit<string, T>;

    export type Promisify<T> = T | Promise<T>;
}
