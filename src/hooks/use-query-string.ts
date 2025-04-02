import { useMemo } from "react";
import { QueryString } from "../types/query-string";
import { fromStringToValue } from "../utils/mappers";
import { mapUrlToQueryStringRecord, transformData } from "../utils/utils";
import { useBrouther } from "./use-brouther";
import { useUrlSearchParams } from "./use-search-params";

/*
    The representation of the query-string, but as simple plain javascript object
 */

export const useQueryString = <T extends {} | string>(_?: T): T extends string ? QueryString.Parse<T> : T => {
    const { href, page } = useBrouther();
    const urlSearchParams = useUrlSearchParams();
    return useMemo(
        () => (page === null ? ({} as any) : transformData(urlSearchParams, mapUrlToQueryStringRecord(page.originalPath, fromStringToValue))),
        [href, page, urlSearchParams]
    );
};
