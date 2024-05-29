import type { Parser, PathFormat } from "../types";
import type { QueryString } from "../types/query-string";
import { has, trailingOptionalPath, urlEntity, join } from "./utils";

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
    Date: dateParse,
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

export const transformParams = (params: {}) =>
    Object.keys(params).reduce((acc, el) => {
        const [opt, transform] = el.split("___");
        const key = opt || transform;
        const val = (params as any)[el];
        if (transform === undefined) return { ...acc, [key]: val };
        const t = transform.toLowerCase();
        const mapper = has(pathsToValue, t);
        return mapper ? { ...acc, [key]: pathsToValue[t](val) } : { ...acc, [key]: (params as any)[el] };
    }, {});

export const parsePath = (arg: { path: string; basename: string; sensitiveCase?: boolean }) => {
    const pathname = decodeURIComponent(urlEntity(arg.path).pathname);
    const transformedPath = join(arg.basename, trailingOptionalPath(pathname)) as PathFormat;
    const pathReplace = transformedPath.replace(/(<\w+:(\w+)>|:\w+)/gm, (t) => {
        const token = t.replace("<", "").replace(">", "").replace(":", "___");
        return `(?<${token.replace(/^:/g, "")}>[^/:]+)`;
    });
    return { regex: new RegExp(`^${pathReplace}$`, arg.sensitiveCase ? "" : "i"), path: transformedPath };
};
