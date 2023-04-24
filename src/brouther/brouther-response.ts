import { AnyJson } from "../types";

export const jsonResponse = <T extends AnyJson>(t: T, responseInit?: ResponseInit): Response => new Response(JSON.stringify(t), responseInit);

export const redirectResponse = (path: string) => new Response(null, { status: 302, headers: { Location: path } });
