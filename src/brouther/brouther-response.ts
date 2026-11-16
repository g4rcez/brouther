type SerializablePrimitive = string | number | boolean | bigint | symbol | undefined | null;

type IsAny<Value> = 0 extends 1 & Value ? true : false;

type ParseSerializableValue<Value> =
    IsAny<Value> extends true
        ? unknown
        : Value extends Date
          ? string
          : Value extends SerializablePrimitive
            ? Value
            : Value extends readonly unknown[]
              ? { [Key in keyof Value]: ParseSerializableValue<Value[Key]> }
              : Value extends object
                ? { [Key in keyof Value]: ParseSerializableValue<Value[Key]> }
                : Value;

export type ParseSerializable<Value> = ParseSerializableValue<Value>;

export type CustomResponse<Value extends {} = {}> = Response & {
    __brand: ParseSerializable<Value>;
    result?: Value;
};

export type InferLoader<T extends (...args: never[]) => unknown> =
    Awaited<ReturnType<T>> extends {
        __brand: infer Value;
    }
        ? Value
        : never;

export const jsonResponse = <T extends {}>(t: T, responseInit?: ResponseInit): CustomResponse<T> => {
    const r = new Response(JSON.stringify(t), responseInit) as any;
    return Object.assign(r, { result: t });
};

export const redirectResponse = (path: string): CustomResponse<never> =>
    new Response(null, {
        status: 302,
        headers: { Location: path },
    }) as any;
