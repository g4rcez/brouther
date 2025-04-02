import { X } from "../types/x";
import { BroutherError } from "../utils/errors";
import { useBrouther } from "./use-brouther";

/*
    Instance of any occurred error in r
*/
export const useErrorPage = <T extends BroutherError>() => {
    const ctx = useBrouther();
    return (ctx?.error as X.Nullable<T>) ?? null;
};
