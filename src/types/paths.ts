import type { QueryString } from "./query-string";

type RouteLike = { readonly path: string };

type GetPathname<Path extends string> = Path extends `${infer Name}?${string}` ? Name : Path;

type Merge<Value> = { [Key in keyof Value]: Value[Key] };

type ParameterTypes = {
    Date: Date;
    string: string;
    number: number;
    boolean: boolean;
};

type ParameterValue<Type extends string> = Type extends keyof ParameterTypes ? ParameterTypes[Type] : string;

type ExtractParameter<Segment extends string> = Segment extends `<${infer Name}:${infer Type}>#${string}`
    ? [Name, ParameterValue<Type>]
    : Segment extends `:${infer Name}#${string}`
      ? [Name, string]
      : Segment extends `<${infer Name}:${infer Type}>`
        ? [Name, ParameterValue<Type>]
        : Segment extends `:${infer Name}`
          ? [Name, string]
          : never;

type AddParameter<Segment extends string, Result extends {}> = [ExtractParameter<Segment>] extends [never]
    ? Result
    : ExtractParameter<Segment> extends [infer Name extends string, infer Value]
      ? Result & { [Key in Name]: Value }
      : Result;

type ParsePath<Path extends string, Result extends {} = {}> = Path extends `${infer Segment}/${infer Rest}`
    ? ParsePath<Rest, AddParameter<Segment, Result>>
    : AddParameter<Path, Result>;

type ParsedPath<Path extends string> =
    GetPathname<Path> extends `${string}:${string}`
        ? ParsePath<GetPathname<Path>> extends infer Result extends {}
            ? keyof Result extends never
                ? null
                : Merge<Result>
            : never
        : null;

type PathValue<Value> = Value extends Date ? string : Value extends string | number | boolean | bigint ? Value : string;

type AssignSegment<
    Segment extends string,
    Params extends {},
> = Segment extends `<${infer Name}:${string}>#${infer Hash}`
    ? Name extends keyof Params
        ? `${PathValue<Params[Name]>}#${Hash}`
        : Segment
    : Segment extends `:${infer Name}#${infer Hash}`
      ? Name extends keyof Params
          ? `${PathValue<Params[Name]>}#${Hash}`
          : Segment
      : Segment extends `<${infer Name}:${string}>`
        ? Name extends keyof Params
            ? `${PathValue<Params[Name]>}`
            : Segment
        : Segment extends `:${infer Name}`
          ? Name extends keyof Params
              ? `${PathValue<Params[Name]>}`
              : Segment
          : Segment;

type AssignPathname<
    Path extends string,
    Params extends {},
    Result extends string = "",
> = Path extends `${infer Segment}/${infer Rest}`
    ? AssignPathname<Rest, Params, `${Result}${AssignSegment<Segment, Params>}/`>
    : `${Result}${AssignSegment<Path, Params>}`;

type AssignPathValue<Path extends string, Params extends {}> = Path extends `${infer Pathname}?${infer Query}`
    ? `${AssignPathname<Pathname, Params>}?${Query}`
    : AssignPathname<Path, Params>;

export namespace Paths {
    export type Pathname<Path extends string> = GetPathname<Path>;

    export type Parse<Path extends string> = ParsedPath<Path>;

    export type Map<Router extends Record<string, RouteLike>> = Router[keyof Router]["path"];

    export type PathsQs<Path extends string> =
        Parse<Pathname<Path>> extends null
            ? QueryString.Has<Path> extends true
                ? QueryString.Parse<Path>
                : Parse<Pathname<Path>>
            : QueryString.Parse<Path>;

    export type Assign<Path extends string, Params extends {}, _I extends number = 0> = AssignPathValue<Path, Params>;

    export type Has<Path extends string> = Path extends `${string}/:${string}`
        ? true
        : Path extends `${string}<${string}:${string}>${string}`
          ? true
          : false;
}
