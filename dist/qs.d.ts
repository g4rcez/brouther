declare type QueryString<T> = {
    [key in keyof T]: T[key];
};
export declare const QS: {
    stringify: <T>(qs: QueryString<T>) => string;
    parse: <T_1 extends unknown>(urlString: string) => T_1;
    joinUrl: (url: string, uri?: string | undefined) => string;
};
export {};
