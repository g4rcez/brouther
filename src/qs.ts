type QueryString<T> = {
  [key in keyof T]: T[key];
};

const joinUrl = (url: string, uri?: string) =>
  uri ? `${url.replace(/\/+$/, "")}/${uri.replace(/^\/+/, "")}` : url;

const strictEncode = (str: string) =>
  encodeURIComponent(str).replace(
    new RegExp("[!'()*]", "g"),
    (x) => `%${x.charCodeAt(0).toString(16).toUpperCase()}`
  );

const encodeArray = (key: string) => (result: string[], value: string) => {
  if (value === null || value === undefined || value.length === 0) {
    return result;
  }
  if (result.length === 0) {
    return [[strictEncode(key), "=", strictEncode(value)].join("")];
  }
  return [[result, strictEncode(value)].join(",")];
};

const stringify = <T>(qs: QueryString<T>): string => {
  return Object.entries(qs)
    .map(([key, val]) => {
      if (val === undefined) return "";
      return Array.isArray(val)
        ? val.reduce(encodeArray(key), []).join("&")
        : strictEncode(key) + "=" + strictEncode(val as any);
    })
    .filter((x) => x.length > 0)
    .join("&");
};

const urlQuery = (urlString: string) =>
  urlString.match(/[^&?]*?=[^&?]*/g) ?? [];

const queryValues = (parameter: string): string[][] =>
  parameter.split("&").map((param: string): string[] => param.split("="));

const parse = <T extends any>(urlString: string): T => {
  const arr = urlQuery(urlString);
  if (Array.isArray(arr) && arr.length > 0) {
    return arr
      .map((parameter) => new Set(queryValues(parameter)))
      .reduce((acc, el) => {
        const [name, value] = el.values().next().value;
        try {
          return { ...acc, [name]: JSON.parse(decodeURIComponent(value)) };
        } catch (error) {
          return { ...acc, [name]: decodeURIComponent(value) };
        }
      }, {}) as never;
  }
  return {} as never;
};

export const QS = { stringify, parse, joinUrl };
