import type { CreateHref, Parser, ParsersMap, PathFormat, Route } from "../types";
import type { Paths } from "../types/paths";
import type { QueryString } from "../types/query-string";
import { X } from "../types/x";
import { fromValueToString, QueryStringMapper } from "./mappers";
import { stringifyTextFragment, TEXT_FRAGMENT_ID, TextFragment } from "./text-fragment";
import { type IStringifyOptions, stringify as toQs, parse as fromQs, type IParseOptions } from "qs";

const parseQsOptions: IParseOptions = {
    allowDots: true,
    allowSparse: true,
    parseArrays: true,
    strictDepth: true,
    plainObjects: true,
    duplicates: "combine",
    allowEmptyArrays: true,
    allowPrototypes: false,
    ignoreQueryPrefix: true,
    strictNullHandling: true,
    depth: Number.POSITIVE_INFINITY,
    arrayLimit: Number.POSITIVE_INFINITY,
};

const qsOptions: IStringifyOptions = {
    indices: true,
    allowDots: true,
    arrayFormat: "comma",
    allowEmptyArrays: true,
    strictNullHandling: true,
    serializeDate: (d) => d.toISOString(),
    sort(a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    },
} as const;

export const has = <T extends {}, K extends X.AnyString<keyof T>>(o: T, k: K): k is K =>
    Object.prototype.hasOwnProperty.call(o, k as any);

const replaceUrlParams = <Path extends string, Keys extends Paths.Parse<Path>>(path: string, keys: Keys | undefined) =>
    keys === undefined
        ? path
        : decodeURIComponent(path)
            .replace(/(<(\w+):(\w+)>)/, (_, __, key) => (keys as any)[key])
            .replace(/:(\w+)/g, (_, b) => `${(keys as any)[b]}`);

export const mergeUrlEntities = (
    url: string,
    params: any | undefined,
    qs: any | undefined,
    parsers: Partial<QueryStringMapper<string>> | undefined,
    textFragment: TextFragment[] | undefined
) => {
    const u = urlEntity(url);
    const path = u.pathname;
    const withParams = replaceUrlParams(path, params);
    const queryString =
        qs === undefined
            ? u.pathname === withParams
                ? qsToString(url, params, parsers)
                : ""
            : qsToString(url, qs, parsers);
    const href = queryString === "" ? withParams : `${withParams}?${queryString}`;
    const hasFragments = textFragment !== undefined && textFragment.length >= 1;
    return u.hash || hasFragments
        ? `${href}${u.hash || "#"}${hasFragments ? `${TEXT_FRAGMENT_ID}${stringifyTextFragment(textFragment!)}` : ""}`
        : href;
};

export const trailingOptionalPath = (str: string) => str.replace(/\/+$/g, "/?");

export const urlEntity = (url: string, host = "http://localhost") => {
    const sanitize = url.replace(/\?$/, "").replace(/\/+$/, "/");
    try {
        return new URL(sanitize, host);
    } catch (e) {
        return new URL(sanitize);
    }
};

export const createHref = (pathname: string, search: string, hash: string, basename: string) => {
    const u = urlEntity(pathname);
    u.search = search;
    u.hash = hash;
    return u.href.replace(u.origin, "").replace(new RegExp(`^/${basename}`, "gi"), "/");
};

export const transformData = <T extends {}>(o: URLSearchParams | FormData, map: ParsersMap): T => {
    const object: any = {};
    o.forEach((v, key) => {
        const parser = map.get(key);
        const value = parser === undefined ? v : parser(v, key);
        if (!has(object, key)) return (object[key] = value);
        if (!Array.isArray(object[key])) object[key] = [object[key]];
        object[key].push(value);
    });
    return object;
};

const regex = { init: /^\/+/, end: /\/+$/ };

export const trailingPath = (str: string) => (str === "/" ? str : str.replace(regex.init, "/").replace(regex.end, ""));

export const join = (baseURL: string, ...urls: string[]) =>
    trailingPath(urls.reduce((acc, el) => acc.replace(regex.end, "") + "/" + el.replace(regex.init, ""), baseURL));

export const setBasename = (basename: string, path: string) =>
    path.startsWith(basename) ? path : join("/", basename, path);

const queryStringArray = (v: string) => v.endsWith("[]!") || v.endsWith("[]");

const extractQsParser = (value: string) => value.replace(/\[]$/, "").replace(/\[]!/, "").replace(/!/, "");

export const mapUrlToQueryStringRecord = (query: string, mapper: QueryStringMapper): ParsersMap => {
    const entries = new Map<string, Parser>();
    if (query === undefined || query === "") return entries;
    return query.split("&").reduce((map, pair) => {
        const [k, value] = pair.split("=");
        const v = extractQsParser(value);
        if (!has(mapper, v as any)) return map;
        const dataTransformer = mapper[v as keyof QueryString.Mappers]!;
        if (queryStringArray(v))
            return map.set(k, (a: any) => JSON.parse(a).map((x: any) => dataTransformer(`${x}`, k)));
        return map.set(k, dataTransformer);
    }, entries);
};

const getValuesFromObject = (input: object, ref: object) =>
    Object.keys(input).reduce(
        (acc, el): Record<string, any> => {
            const value = (ref as any)[el];
            if (typeof value === "object") return { ...acc, [el]: getValuesFromObject((input as any)[el], value) };
            return { ...acc, [el]: value };
        },
        {} as Record<string, any>
    );

export const safeQs = (url: string): string => url.split("?")[1];

export const qsToString = <Path extends string, T extends QueryString.Map>(
    path: Path,
    data?: X.Nullable<T>,
    parsers?: Partial<QueryStringMapper<keyof T>>
): string => {
    if (data === null || data === undefined) return "";
    const qsString = safeQs(path);
    const qsAsObject = fromQs(qsString, parseQsOptions);
    const parameterized = Object.entries(qsAsObject).reduce((acc, el) => {
        const [key, value] = el;
        const parsedValue =
            typeof value === "object" ? getValuesFromObject(value as object, data[key] as any) : data[key];
        const transformer = parsers?.[key];
        if (transformer) return { ...acc, [key]: transformer(parsedValue, key) };
        return { ...acc, [key]: parsedValue };
    }, {});
    return toQs(parameterized, qsOptions);
};

export const createLink =
    <T extends readonly Route[]>(_routes: T): CreateHref<T> =>
        (...args: any): any =>
            mergeUrlEntities(args[0], args[1], args[2], args[3], args[4]) as never;

const rankBinds = (path: string) => path.split(":").length * 5;

const rankPaths = (path: string) => path.split("/").length;

export const rankRoutes = <T extends Array<{ path: string }>>(routes: T) =>
    routes.sort((a, b) => {
        const scoreA = rankPaths(a.path) + rankBinds(a.path);
        const scoreB = rankPaths(b.path) + rankBinds(b.path);
        return scoreA - scoreB;
    });

export const createPaths = <const T extends Record<string, PathFormat>>(
    t: T
): {
        [K in keyof T]: { name: K; value: T[K] };
    } => Object.keys(t).reduce((acc, el) => ({ ...acc, [el]: { name: el, value: t[el] } }), {}) as any;

export type GetPaths<T extends ReturnType<typeof createPaths>> = {
    [K in keyof T]: T[K]["value"];
};

export const fetchTarget = (
    openExternalLinksInNewTab: boolean,
    href: string,
    origin: string = window.location.origin
): "_blank" | undefined =>
    !openExternalLinksInNewTab ? undefined : new URL(href, origin).origin === origin ? undefined : "_blank";
