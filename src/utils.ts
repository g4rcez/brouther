import { Nullable, QueryStringMappers, QueryStringRecord, Parser, UrlParams, ParsersMap } from "./types";
import { fromStringToValue, fromValueToString, QueryStringMapper } from "./mappers";

export const has = <T extends {}, K extends keyof T>(o: T, k: K): k is K => Object.prototype.hasOwnProperty.call(o, k);

const replaceUrlParams = <Path extends string, Keys extends UrlParams<Path>>(path: string, keys: Keys | undefined) =>
    keys === undefined ? path : path.replace(/:(\w+)/g, (_, b) => `${(keys as any)[b]}`);

export const mergeUrlEntities = (url: string, params: any | undefined, _qs: any | undefined) => {
    const u = urlEntity(url);
    const path = u.pathname;
    const withParams = replaceUrlParams(path, params);
    const queryString = _qs === undefined ? "" : qsToString(url, _qs);
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

export const transformData = <T extends {}>(o: URLSearchParams, map: ParsersMap): T => {
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

const isQsArray = (v: string) => v.endsWith("[]!") || v.endsWith("[]");

const extractQsParser = (value: string) => value.replace(/\[]$/, "").replace(/\[]!/, "").replace(/!/, "");

export const mapUrlToQueryStringRecord = (path: string, mapper: QueryStringMapper): ParsersMap => {
    const query = path.split("?")[1];
    if (query === undefined || query === "") return new Map();
    return query.split("&").reduce((map, pair) => {
        const [k, value] = pair.split("=");
        const v = extractQsParser(value);
        if (!has(mapper, v as any)) return map;
        const dataTransformer = mapper[v as keyof QueryStringMappers]!;
        if (isQsArray(v)) return map.set(k, (a: any) => JSON.parse(a).map((x: any) => dataTransformer(`${x}`, k)));
        return map.set(k, dataTransformer);
    }, new Map<string, Parser>());
};

export const qsToString = <Path extends string, T extends QueryStringRecord>(path: Path, o?: Nullable<T>): string => {
    if (o === null || o === undefined) return "";
    const dict = mapUrlToQueryStringRecord(path, fromValueToString);
    const searchParams = Object.entries(o).reduce((urlSearchParams, pair) => {
        const [k, v] = pair;
        const transformer = dict.get(k);
        if (Array.isArray(v)) {
            v.forEach((value) => {
                if (value) {
                    const parsedValue = transformer !== undefined ? transformer(value, k) : value.toString();
                    urlSearchParams.append(k, encodeURIComponent(parsedValue));
                }
            });
            return urlSearchParams;
        }
        if (transformer) urlSearchParams.set(k, transformer(v, k));
        else urlSearchParams.set(k, v?.toString() ?? "");
        return urlSearchParams;
    }, new URLSearchParams());
    searchParams.sort();
    return searchParams.toString();
};

type QueryStringRemapper = (v: any, key: string) => string;

export const remapQueryStringParams = (q: string): QueryStringRemapper => {
    const dict = mapUrlToQueryStringRecord(q, fromStringToValue);
    if (dict.size === 0) return () => "";
    return (v: any, key: string) => {
        const fn = dict.get(key);
        return fn ? fn(v, key) : v;
    };
};
