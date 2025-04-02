import { useMemo } from "react";
import { join, urlEntity } from "../utils/utils";
import { useBrouther } from "./use-brouther";

/*
    Get the current route as URL object
    @returns [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL)
 */
export const useURL = (): URL => {
    const { basename, href } = useBrouther();
    return useMemo(() => urlEntity(href, join(window.location.origin, basename)), [href, basename]);
};
