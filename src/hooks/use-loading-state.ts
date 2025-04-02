import { useBrouther } from "./use-brouther";

/*
    Boolean that represents if it's your action/loader process is loading
    @returns string
 */
export const useLoadingState = () => useBrouther().loading;
