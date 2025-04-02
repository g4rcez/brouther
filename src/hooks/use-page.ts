import { useBrouther } from "./use-brouther";

/*
    The element that matches with the current URL
*/
export const usePage = () => {
    const b = useBrouther();
    return b.firstLoading ? (b.page?.loadingElement ?? b.page?.element ?? null) : (b.page?.element ?? null);
};
