import { AnyJson, Loader } from "../types";

export type CustomResponse<T> = Response & { __brand: T };

export type FromLoader<T extends Loader<any, any>> = Awaited<ReturnType<T>>["__brand"]

export const jsonResponse = <T extends AnyJson>(t: T, responseInit?: ResponseInit): CustomResponse<T> =>
    new Response(JSON.stringify(t), responseInit) as any;

export const redirectResponse = (path: string): CustomResponse<any> =>
    new Response(null, {
        status: 302,
        headers: { Location: path },
    }) as any;
