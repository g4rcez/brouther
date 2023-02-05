import { QueryStringMappers, Transformer } from "./types";

export type QueryStringMapper = Record<keyof QueryStringMappers, Transformer>;
export const fromStringToValue: QueryStringMapper = {
    string: (a) => a,
    null: () => null,
    number: (n) => Number(n),
    boolean: (v) => (v === "false" ? false : Boolean(v)),
    date: (d) => {
        try {
            return new Date(d);
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
