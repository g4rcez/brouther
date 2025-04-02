import { useBrouther } from "./use-brouther";

/*
    Get current basename
    @returns string
 */
export const useBasename = (): string => useBrouther().basename;
