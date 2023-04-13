import type { CreateHref, Nullable, Parser, ParsersMap, Route } from "./types";
import { fromValueToString, QueryStringMapper } from "./mappers";
import type { Function } from "ts-toolbelt";
import type { Paths } from "./types/paths";
import type { QueryString } from "./types/query-string";

export const has = <T extends {}, K extends keyof T>(o: T, k: K): k is K => Object.prototype.hasOwnProperty.call(o, k);

const replaceUrlParams = <Path extends string, Keys extends Paths.Variables<Path>>(path: string, keys: Keys | undefined) =>
    keys === undefined ? path : path.replace(/:(\w+)/g, (_, b) => `${(keys as any)[b]}`);

export const mergeUrlEntities = (url: string, params: any | undefined, qs: any | undefined, parsers?: Partial<QueryStringMapper<string>>) => {
    const u = urlEntity(url);
    const path = u.pathname;
    const withParams = replaceUrlParams(path, params);
    const queryString = qs === undefined ? "" : qsToString(url, qs, parsers);
    const href = queryString === "" ? withParams : `${withParams}?${queryString}`;
    return u.hash ? `${href}#${u.hash}` : href;
};

export const trailingOptionalPath = (str: string) => str.replace(/\/+$/g, "/?");

export const urlEntity = (url: string) => new URL(url, "http://localhost");

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

const regex = { trailingInit: /^\/+/g, trailingEnd: /\/+$/g };

export const trailingPath = (str: string) => str.replace(regex.trailingInit, "/").replace(regex.trailingEnd, "/");

export const join = (baseURL: string, ...urls: string[]) =>
    trailingPath(urls.reduce((acc, el) => acc.replace(regex.trailingEnd, "") + "/" + el.replace(regex.trailingInit, ""), baseURL));

export const setBasename = (basename: string, path: string) => (path.startsWith(basename) ? path : join("/", basename, path));

const queryStringArray = (v: string) => v.endsWith("[]!") || v.endsWith("[]");

const extractQsParser = (value: string) => value.replace(/\[]$/, "").replace(/\[]!/, "").replace(/!/, "");

export const mapUrlToQueryStringRecord = (path: string, mapper: QueryStringMapper): ParsersMap => {
    const query = path.split("?")[1];
    const entries = new Map<string, Parser>();
    if (query === undefined || query === "") return entries;
    return query.split("&").reduce((map, pair) => {
        const [k, value] = pair.split("=");
        const v = extractQsParser(value);
        if (!has(mapper, v as any)) return map;
        const dataTransformer = mapper[v as keyof QueryString.Mappers]!;
        if (queryStringArray(v)) return map.set(k, (a: any) => JSON.parse(a).map((x: any) => dataTransformer(`${x}`, k)));
        return map.set(k, dataTransformer);
    }, entries);
};

export const qsToString = <Path extends string, T extends QueryString.Map>(
    path: Path,
    data?: Nullable<T>,
    parsers?: Partial<QueryStringMapper<keyof T>>
): string => {
    if (data === null || data === undefined) return "";
    const dict = mapUrlToQueryStringRecord(path, fromValueToString);
    const searchParams = Object.entries(data).reduce((urlSearchParams, pair) => {
        const [k, v] = pair;
        const transformer = parsers?.[k] ?? dict.get(k);
        if (Array.isArray(v)) {
            v.forEach((value) => {
                if (value) {
                    const parsedValue = transformer !== undefined ? transformer(value, k) : value.toString();
                    urlSearchParams.append(k, parsedValue);
                }
            });
            return urlSearchParams;
        }
        if (transformer) urlSearchParams.set(k, transformer(v, k));
        else urlSearchParams.set(k, v?.toString() ?? "");
        return urlSearchParams;
    }, new URLSearchParams());
    // Make sort to grant consistency for our query-string.
    searchParams.sort();
    return searchParams.toString();
};

export const createLink =
    <T extends Function.Narrow<Route[]>>(_routes: T): CreateHref<T> =>
    (...args: any): any =>
        mergeUrlEntities(args[0], args[1], args[2], args[3]) as never;

const rankBinds = (path: string) => path.split(":").length * 5;

const rankPaths = (path: string) => path.split("/").length;

export const rankRoutes = <T extends Array<{ path: string }>>(routes: T) =>
    routes.sort((a, b) => {
        const scoreA = rankPaths(a.path) + rankBinds(a.path);
        const scoreB = rankPaths(b.path) + rankBinds(b.path);
        return scoreA - scoreB;
    });
