import { Nullable, QueryStringMappers, QueryStringRecord, UrlParams } from "./types";

export const keys = <T extends {}>(o: T): Array<keyof T> => Object.keys(o) as any;

export const encodeTuple = (key: string, val: string | null) => {
    const v = val?.toString();
    return `${encodeURIComponent(key.toString())}=${v === undefined ? "" : v === null ? null : encodeURIComponent(v)}`;
};

const replaceUrlParams = <Path extends string, Keys extends UrlParams<Path>>(path: string, keys: Keys | undefined) =>
    keys === undefined ? path : path.replace(/:(\w+)/g, (_, b) => `${(keys as any)[b]}`);

export const mergeUrlEntities = (url: string, params: any | undefined, _qs: any | undefined) => {
    const u = urlEntity(url);
    const path = u.pathname;
    const withParams = replaceUrlParams(path, params);
    const queryString = qs(_qs);
    const href = queryString === "" ? withParams : `${withParams}?${queryString}`;
    return u.hash ? `${href}#${u.hash}` : href;
};

export const trailingOptionalPath = (str: string) => str.replace(/\/+$/g, "/?");

export const urlEntity = (url: string) => new URL(url, "http://localhost");

export const qs = <T extends QueryStringRecord>(o?: Nullable<T>) =>
    o === null || o === undefined
        ? ""
        : keys(o)
              .reduce<string[]>((acc, key) => {
                  const val: any = o[key];
                  if (val === undefined) return acc;
                  if (val === null) return [...acc, encodeTuple(key as string, null)];
                  return Array.isArray(val)
                      ? [...acc, ...val.map((x) => encodeTuple(key as string, x as never))]
                      : [...acc, encodeTuple(key as string, val as string)];
              }, [])
              .join("&");

export const createHref = (pathname: string, search: string, hash: string, basename: string) => {
    const u = urlEntity(pathname);
    u.search = search;
    u.hash = hash;
    return u.href.replace(u.origin, "").replace(new RegExp(`^/${basename}`, "gi"), "/");
};

const jsonParse = (a: any) => {
    try {
        return JSON.parse(a);
    } catch (error) {
        return a;
    }
};

export const has = <T extends {}, K extends keyof T>(o: T, k: K): k is K => Object.prototype.hasOwnProperty.call(o, k);

type Data = FormData | URLSearchParams;

export type Transformer = (data: any, key: string) => any;

export const transformData = <T extends {}>(o: Data, parser: Transformer = jsonParse): T => {
    const object: any = {};
    o.forEach((v, key) => {
        const value = parser(v, key);
        if (!has(object, key)) return (object[key] = value);
        if (!Array.isArray(object[key])) object[key] = [object[key]];
        object[key].push(value);
    });
    return object;
};

const regex = {
    trailingInit: /^\/+/g,
    trailingEnd: /\/+$/g,
};

export const trailingPath = (str: string) => str.replace(regex.trailingInit, "/").replace(regex.trailingEnd, "/");

export const join = (baseURL: string, ...urls: string[]) =>
    trailingPath(urls.reduce((acc, el) => acc.replace(regex.trailingEnd, "") + "/" + el.replace(regex.trailingInit, ""), baseURL));

export const applyBasename = (basename: string, path: string) => (path.startsWith(basename) ? path : join("/", basename, path));

const queryStringMappers: Record<keyof QueryStringMappers, Transformer> = {
    string: (a) => a,
    number: (n) => Number(n),
    null: () => null,
    boolean: (v) => (v === "false" ? false : Boolean(v)),
    date: (d) => {
        try {
            return new Date(d);
        } catch (e) {
            return new Date("");
        }
    },
};

const isQueryStringArray = (v: string) => v.endsWith("[]!") || v.endsWith("[]");

export const remapQueryStringParams = (q: string) => {
    const query = q.split("?")[1];
    const dict = query.split("&").reduce((map, pair) => {
        const [k, v] = pair.split("=");
        if (!has(queryStringMappers, v as any)) return map;
        const dataTransformer = queryStringMappers[v as keyof QueryStringMappers]!;
        if (isQueryStringArray(v)) return map.set(k, (a: any) => (JSON.parse(a) as any[]).map((x) => dataTransformer(`${x}`, k)));
        return map.set(k, dataTransformer);
    }, new Map<string, Transformer>());
    return (v: any, key: string) => {
        const fn = dict.get(key);
        return fn ? fn(v, key) : v;
    };
};
