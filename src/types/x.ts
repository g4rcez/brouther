export namespace X {
    export type Nullable<T> = T | null;

    export type Hide<T, K extends keyof T> = Omit<T, K>;

    export type Coallesce<T, Defaults = T> = T extends null ? Defaults : NonNullable<T>;

    export type AnyString<T extends string | number | symbol> = T | Omit<string, T>;
}
