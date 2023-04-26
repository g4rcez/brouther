import type { IParseOptions, IStringifyOptions } from "qs";
import { parse, stringify } from "qs";

const sort = (a: string, b: string) => a.localeCompare(b);

const options: IParseOptions & IStringifyOptions = {
    allowDots: true,
    allowPrototypes: false,
    charset: "utf-8",
    depth: false,
    format: "RFC3986",
    parseArrays: true,
    plainObjects: true,
    sort,
} as const;

export const urlSearchParamsToJson = (search: URLSearchParams) => parse(search.toString(), options);

export const formToJson = <T extends Record<string, unknown>>(form: HTMLFormElement): T =>
    urlSearchParamsToJson(new URLSearchParams(new FormData(form) as any)) as T;

export const jsonToURLSearchParams = <T extends {}>(json: T) => new URLSearchParams(stringify(json, options));
