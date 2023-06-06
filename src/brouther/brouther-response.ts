import { Serializable } from "../types";

type ParseSerializable<T> = {
    [K in keyof T]: T[K] extends {} ? ParseSerializable<T[K]> : T[K] extends Serializable ? T[K] : T[K] extends Date | undefined ? string : T[K];
};

export type CustomResponse<T extends {}> = Response & { __brand: ParseSerializable<T> };

export type InferLoader<T extends (...a: any[]) => Promise<CustomResponse<any>> | CustomResponse<any>> = Awaited<ReturnType<T>>["__brand"];

export const jsonResponse = <T extends {}>(t: T, responseInit?: ResponseInit): CustomResponse<T> =>
    new Response(JSON.stringify(t), responseInit) as any;

export const redirectResponse = (path: string): CustomResponse<never> =>
    new Response(null, {
        status: 302,
        headers: { Location: path },
    }) as any;
