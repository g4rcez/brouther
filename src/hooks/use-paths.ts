import type { Paths } from "../types/paths";
import { useBrouther } from "./use-brouther";

type UsePaths = <T extends string>(t?: T) => Paths.Parse<T>;

/*
    All dynamic paths in the url, represented by /users/:id, for example
 */
export const usePaths: UsePaths = <T extends string>(_path?: T): Paths.Parse<T> => useBrouther().paths! as never;
