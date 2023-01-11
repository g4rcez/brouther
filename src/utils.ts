import { QueryStringRecord, UrlParams } from "./types";
import { Nullable } from "ts-toolbelt/out/Object/Nullable";

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

const parse = (a: any) => {
    try {
        return JSON.parse(a);
    } catch (error) {
        return a;
    }
};

export const has = <T extends {}, K extends keyof T>(o: T, k: K): k is K => Object.prototype.hasOwnProperty.call(o, k);

type Data = FormData | URLSearchParams;

export const transformData = <T extends {}>(o: Data): T => {
    const object: any = {};
    o.forEach((v, key) => {
        const value = parse(v);
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
