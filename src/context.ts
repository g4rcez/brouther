import React, { createContext } from "react";
import { CustomResponse } from "./brouther/brouther-response";
import { RouterNavigator } from "./router/router-navigator";
import type { BroutherFlags, ConfiguredRoute, Location } from "./types";
import { BrowserHistory } from "./types/history";
import { X } from "./types/x";
import { BroutherError, NotFoundRoute } from "./utils/errors";

export type Base = {
    link: any;
    links: any;
    basename: string;
    history: BrowserHistory;
    routes: ConfiguredRoute[];
    navigation: RouterNavigator;
};

export type ActionState<R = any> =
    | { state: "idle"; loading: false }
    | { loading: true; state: "submitting" }
    | { loading: false; state: "submitted"; result: undefined | R; response: CustomResponse<any> };

export type ContextState = {
    loading: boolean;
    location: Location;
    actions: ActionState;
    firstLoading: boolean;
    error: X.Nullable<BroutherError>;
    loaderData: X.Nullable<Response>;
    cache: CustomResponse<any> | null;
    loadingElement?: React.ReactElement;
    loaderDataPromise: null | CustomResponse<any> | Promise<CustomResponse<any>>;
    matches:
    | {
        error: null;
        params: object;
        page: ConfiguredRoute;
    }
    | { page: null; error: NotFoundRoute; params: object };
};

export type ContextProps = ContextState & {
    paths: {};
    config: Base;
    href: string;
    basename: string;
    loading: boolean;
    location: Location;
    flags?: BroutherFlags;
    navigation: RouterNavigator;
    loaderData: X.Nullable<Response>;
    page: X.Nullable<ConfiguredRoute>;
    error: X.Nullable<BroutherError | Error>;
    setLoading: (b: boolean) => void;
    setState: (
        stateOrFn:
            | Omit<ContextState, "setState">
            | ((prev: Omit<ContextState, "setState">) => Omit<ContextState, "setState">)
    ) => void;
};

export const Context = createContext<Omit<ContextProps, "loaderDataPromise"> | undefined>(undefined);
