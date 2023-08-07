import { parse, stringify } from "qs";

const sort = (a: string, b: string) => a.localeCompare(b);

type NullToUndefined<T> = T extends null ? undefined : T;

type RecNTU<T> = {
    [K in keyof T]: T[K] extends {} ? RecNTU<T[K]> : T[K] extends any[] ? RecNTU<T[K]> : NullToUndefined<T[K]>;
};

const options = {
    sort,
    allowDots: true,
    charset: "utf-8",
    parseArrays: true,
    plainObjects: true,
    charsetSentinel: true,
    allowPrototypes: false,
    depth: Number.MAX_SAFE_INTEGER,
    arrayLimit: Number.MAX_SAFE_INTEGER,
    parameterLimit: Number.MAX_SAFE_INTEGER,
} as const;

export const formToJson = <T extends any>(form: HTMLFormElement): RecNTU<T> => {
    const formData = new FormData(form);
    const urlSearchParams = new URLSearchParams(formData as any);
    return parse(urlSearchParams.toString(), options) as never;
};

export const jsonToURLSearchParams = <T extends {}>(json: T) => new URLSearchParams(stringify(json, options));

export const urlSearchParamsToJson = (search: URLSearchParams) => parse(search.toString(), options);
