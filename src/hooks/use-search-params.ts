import { useMemo } from "react";
import { QueryString } from "../types/query-string";
import { urlEntity } from "../utils/utils";
import { useHref } from "./use-href";

/*
    The representation of the query-string as [URLSearchParams](https://developer.mozilla.org/en-us/docs/web/api/urlsearchparams)
*/
export const useUrlSearchParams = <T extends {}>(): QueryString.SearchParams<T> => {
    const href = useHref();
    return useMemo(() => urlEntity(href).searchParams as QueryString.SearchParams<T>, [href]);
};
