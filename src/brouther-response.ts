import { AnyJson } from "./types";

export class BroutherResponse<R> extends Response {
    public static json<T extends AnyJson>(t: T, responseInit?: ResponseInit): BroutherResponse<T> {
        return new Response(JSON.stringify(t), responseInit);
    }

    public static redirect(path: string) {
        return new Response(null, { status: 302, headers: { Location: path } });
    }
}
