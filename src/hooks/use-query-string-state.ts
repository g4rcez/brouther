/*
    The query-string state controller.
 */
import { SetStateAction, useCallback, useMemo } from "react";
import { jsonToURLSearchParams, urlSearchParamsToJson } from "../form/form-data-api";
import { QueryString } from "../types/query-string";
import { fromStringToValue } from "../utils/mappers";
import { mapUrlToQueryStringRecord, transformData } from "../utils/utils";
import { useBrouther } from "./use-brouther";
import { useUrlSearchParams } from "./use-search-params";

export const useQueryStringState = <T extends {} | string>(
    _?: T
): T extends string ? [qs: QueryString.Parse<T>, set: (q: SetStateAction<QueryString.Parse<T>>) => void] : [qs: T, set: SetStateAction<T>] => {
    type Hold = T extends string ? QueryString.Parse<T> : T;
    const { href, page, navigation } = useBrouther();
    const urlSearchParams = useUrlSearchParams();
    const qs: Hold = useMemo(
        () => (page === null ? ({} as any) : transformData(urlSearchParams, mapUrlToQueryStringRecord(page.originalPath, fromStringToValue))),
        [href, page, urlSearchParams]
    );
    const callback = useCallback(
        (query: SetStateAction<Hold>) => {
            const location = new URL(window.location.href);
            const current = urlSearchParamsToJson<Hold>(new URLSearchParams(window.location.search));
            const result = typeof query === "function" ? (query as Function)(current) : { ...(current as any), ...(query as any) };
            location.search = jsonToURLSearchParams(result).toString();
            navigation.push(location.href);
        },
        [navigation]
    );
    return [qs as Hold, callback as (q: Hold | ((h: Hold) => Hold)) => void] as any;
};
