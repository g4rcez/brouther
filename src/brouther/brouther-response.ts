import { Primitive } from "ts-toolbelt/out/Misc/Primitive";

export type ParseSerializable<T> = {
    [K in keyof T]: T[K] extends Primitive ? T[K] : T[K] extends Date | undefined ? string : ParseSerializable<T[K]>;
};

export type CustomResponse<T extends {}> = Response & { __brand: ParseSerializable<T>; result?: any };

export type InferLoader<T extends (...a: any[]) => Promise<CustomResponse<any>> | CustomResponse<any>> = Awaited<ReturnType<T>>["__brand"];

export const jsonResponse = <T extends {}>(t: T, responseInit?: ResponseInit): CustomResponse<T> => {
    const r = new Response(JSON.stringify(t), responseInit) as any;
    return Object.assign(r, { result: t });
};

export const redirectResponse = (path: string): CustomResponse<never> =>
    new Response(null, {
        status: 302,
        headers: { Location: path },
    }) as any;
