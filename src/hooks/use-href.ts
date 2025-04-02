import { useBrouther } from "./use-brouther";

/*
    The current url with pathname, query-string and hash
    @returns string
*/
export const useHref = () => useBrouther().href;
