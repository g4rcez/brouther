import type { Parser } from "../types";
import type { QueryString } from "../types/query-string";

export type QueryStringMapper<T extends string | number | symbol = keyof QueryString.Mappers> = Record<T, Parser>;

const dateParse = (d: string) => {
    try {
        return new Date(decodeURIComponent(d));
    } catch (e) {
        return new Date("");
    }
};

export const fromStringToValue: QueryStringMapper = {
    string: (a) => decodeURIComponent(a),
    null: () => null,
    number: (n) => Number(decodeURIComponent(n)),
    boolean: (b) => (b === "false" ? false : Boolean(b)),
    date: dateParse,
    Date: dateParse
};

export const pathsToValue: Record<string, (n: string) => any> = {
    number: Number,
    string: (s) => s,
    date: (s) => new Date(s),
    boolean: (a) => (a === "false" ? false : Boolean(a)),
};

export const fromValueToString: QueryStringMapper = {
    string: (s) => s,
    null: () => null,
    number: (n) => n.toString(),
    boolean: (v) => v.toString(),
    date: (d) => new Date(d).toISOString(),
    Date: (d) => new Date(d).toISOString(),
};
