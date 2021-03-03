type QueryString<T> = { [key in keyof T]: T[key] };

type Options = Partial<{ strict: boolean; encode: boolean }>;

const joinUrl = (url: string, uri?: string) =>
  uri ? `${url.replace(/\/+$/, "")}/${uri.replace(/^\/+/, "")}` : url;

const encStrict = (str: string) =>
  encodeURIComponent(str).replace(
    new RegExp("[!'()*]", "g"),
    (x) => `%${x.charCodeAt(0).toString(16).toUpperCase()}`
  );

const enc = (value: string | number, options?: Options) => {
  if (options?.encode === undefined) {
    return `${value}`;
  }
  return options.strict ? encStrict(`${value}`) : encodeURIComponent(value);
};

const encodeArray = (key: string, options: Options) => (
  result: string[],
  value: string
) => {
  if (value === null || value === undefined || value.length === 0) {
    return result;
  }
  if (result.length === 0) {
    return [[enc(key, options), "=", enc(value, options)].join("")];
  }
  return [[result, enc(value, options)].join(",")];
};

const stringify = <T>(
  args: QueryString<T>,
  opt: Options = { encode: true, strict: true }
): string => {
  const nonNull = Object.entries(args).reduce(
    (acc, [key, value]: [any, any]) =>
      ((args as any)[key] ? { ...acc, [key]: value } : acc) as string,
    {}
  );
  return Object.entries(nonNull)
    .map(
      ([key, val]: [any, any]) =>
        Array.isArray(val)
          ? val.reduce(encodeArray(key, opt), []).join("&")
          : enc(key, opt) + "=" + enc(val, opt),
      ""
    )
    .filter((x) => x.length > 0)
    .join("&");
};

const urlOnlyParameters = (urlString: string) =>
  urlString.match(/[^&?]*?=[^&?]*/g) ?? [];

const parseKeyVal = (parameter: string): string[][] =>
  parameter.split("&").map((param: string): string[] => param.split("="));

const parse = <T extends any>(urlString: string): T => {
  const arr = urlOnlyParameters(urlString);
  if (Array.isArray(arr)) {
    return arr
      .map((parameter) => new Set(parseKeyVal(parameter)))
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
