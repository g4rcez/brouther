import { createRouter } from "./router";

export { createRouter, createMappedRouter } from "./router";
export { Brouther, useUrlSearchParams, usePage, useNavigation, useErrorPage, usePaths, useQueryString, useHref } from "./brouther";
export { BroutherError, NotFoundRoute } from "./errors";
export { Link } from "./link";
export type { LinkProps } from "./link";
export type { RouterNavigator } from "./router-navigator";
export { urlEntity, mergeUrlEntities, createHref, qsToString, transformData } from "./utils";
export type {
    UrlParams,
    QueryStringMappers,
    Pathname,
    PathsMap,
    QueryStringExists,
    ConfiguredRoute,
    QueryString,
    Route,
} from "./types";
