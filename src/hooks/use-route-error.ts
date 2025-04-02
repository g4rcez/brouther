import { useBrouther } from "./use-brouther";

/*
    Get current error and the current page that throw the error
    @returns string
 */

export const useRouteError = () => {
    const router = useBrouther();
    return [router.error, router.page] as const;
};
