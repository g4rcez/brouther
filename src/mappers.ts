import type { Parser } from "./types";
import type { QueryString } from "./types/query-string";

export type QueryStringMapper<T extends string | number | symbol = keyof QueryString.Mappers> = Record<T, Parser>;

export const fromStringToValue: QueryStringMapper = {
    string: (a) => decodeURIComponent(a),
    null: () => null,
    number: (n) => Number(decodeURIComponent(n)),
    boolean: (b) => (b === "false" ? false : Boolean(b)),
    date: (d) => {
        try {
            return new Date(decodeURIComponent(d));
        } catch (e) {
            return new Date("");
        }
    },
};

export const fromValueToString: QueryStringMapper = {
    string: (s) => s,
    null: () => null,
    number: (n) => n.toString(),
    boolean: (v) => v.toString(),
    date: (d) => new Date(d).toISOString(),
};
