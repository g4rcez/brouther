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
    cache: CustomResponse<any> | null;
    error: X.Nullable<BroutherError>;
    loaderData: X.Nullable<Response>;
    loadingElement?: React.ReactElement;
    matches:
    | {
        error: null;
        params: object;
        page: ConfiguredRoute;
    }
    | { page: null; error: NotFoundRoute; params: object };
};

export type ContextProps = ContextState & {
    basename: string;
    config: Base;
    error: X.Nullable<BroutherError | Error>;
    flags?: BroutherFlags;
    href: string;
    loaderData: X.Nullable<Response>;
    loading: boolean;
    location: Location;
    navigation: RouterNavigator;
    page: X.Nullable<ConfiguredRoute>;
    paths: {};
    setLoading: (b: boolean) => void;
    setState: (
        stateOrFn:
            | Omit<ContextState, "setState">
            | ((prev: Omit<ContextState, "setState">) => Omit<ContextState, "setState">)
    ) => void;
};

export const Context = createContext<ContextProps | undefined>(undefined);
