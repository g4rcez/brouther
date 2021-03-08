export declare const useHistory: () => (import("history").BrowserHistory<import("history").State> | import("history").HashHistory<import("history").State> | import("history").MemoryHistory<import("history").State>) & {
    params: object;
};
export declare const useParams: <T>() => T;
export declare const useLocation: () => import("history").Location<import("history").State>;
export declare const useQueryString: <T extends object>() => T;
