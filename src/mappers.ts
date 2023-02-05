import { QueryStringMappers, Parser } from "./types";

export type QueryStringMapper = Record<keyof QueryStringMappers, Parser>;
export const fromStringToValue: QueryStringMapper = {
    string: (a) => decodeURIComponent(a),
    null: () => null,
    number: (n) => Number(decodeURIComponent(n)),
    boolean: (v) => {
        const b = decodeURIComponent(v);
        return b === "false" ? false : Boolean(b);
    },
    date: (d) => {
        try {
            return new Date(decodeURIComponent(d));
        } catch (e) {
            return new Date("");
        }
    },
};

export const fromValueToString: QueryStringMapper = {
    string: (a) => a,
    null: () => null,
    number: (n) => n.toString(),
    boolean: (v) => v.toString(),
    date: (d) => new Date(d).toISOString(),
};
