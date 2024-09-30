import { type IParseOptions, type IStringifyOptions, parse, stringify } from "qs";

const sort = (a: string, b: string) => a.localeCompare(b);

type NullToUndefined<T> = T extends null ? undefined : T;

type RecNTU<T> = {
    [K in keyof T]: T[K] extends {} ? RecNTU<T[K]> : T[K] extends any[] ? RecNTU<T[K]> : NullToUndefined<T[K]>;
};

const parseOptions: IParseOptions = {
    allowEmptyArrays: true,
    allowDots: true,
    allowPrototypes: false,
    arrayLimit: Number.MAX_SAFE_INTEGER,
    charset: "utf-8",
    charsetSentinel: true,
    depth: Number.MAX_SAFE_INTEGER,
    parameterLimit: Number.MAX_SAFE_INTEGER,
    parseArrays: true,
    plainObjects: true,
    duplicates: "combine",
} as const;

const strOptions: IStringifyOptions = {
    allowDots: true,
    allowEmptyArrays: true,
    indices: true,
    skipNulls: false,
    strictNullHandling: true,
    sort,
};

export const formDataToJson = <T extends any>(formData: FormData): RecNTU<T> => {
    const urlSearchParams = new URLSearchParams(formData as any);
    return parse(urlSearchParams.toString(), parseOptions) as never;
};

export const formToJson = <T extends any>(form: HTMLFormElement): RecNTU<T> => {
    const formData = new FormData(form);
    return formDataToJson(formData);
};

export const jsonToURLSearchParams = <T extends {}>(json: T) => new URLSearchParams(stringify(json, strOptions));

export const urlSearchParamsToJson = <T>(search: URLSearchParams): T => parse(search.toString(), parseOptions) as T;
