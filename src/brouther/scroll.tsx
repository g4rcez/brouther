import { useURL } from "./brouther";
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useLayoutEffect, useRef } from "react";

type ScrollStatus = "idle" | "scroll";

type Behavior = "auto" | "smooth";

type ScrollInformation =
    | { y: number; x: number; scrollSize: number; type: "scroll"; state: ScrollStatus }
    | {
          type: "anchor";
          id: string;
      };

type RawScrollInfo = ScrollInformation & {
    route: string;
};

type Props = {
    root?: HTMLElement;
    behavior?: Behavior;
    initialState?: RawScrollInfo[];
    middleware?: (scrollState: RawScrollInfo[]) => void;
};

const DEFAULT_TIMEOUT = 1200;

const scrollContext = createContext<((id?: string, timeout?: number) => Promise<boolean>) | null>(null);

export const waitFor = (selector: string, timeout: number) =>
    new Promise((resolve, reject) => {
        const id = setTimeout(() => {
            clearTimeout(id);
            return reject(new Error("waitFor timeout"));
        }, timeout);
        const element = document.getElementById(selector);
        if (element) return resolve(element);
        const observer = new MutationObserver(() => {
            const el = document.getElementById(selector);
            if (el) {
                resolve(el);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });

const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView();
};

export const useScroll = () => {
    const ctx = useContext(scrollContext);
    if (ctx === null) throw new Error("ScrollContextError");
    return ctx;
};

export const Scroll = ({ children, initialState, middleware, root = document.documentElement, behavior = "smooth" }: PropsWithChildren<Props>) => {
    const url = useURL();
    const ref = useRef<Map<string, ScrollInformation>>(initialState ? new Map(initialState.map(({ route, ...state }) => [route, state])) : new Map());

    const applyMiddleware = useCallback((map: Map<string, ScrollInformation>) => {
        middleware
            ? middleware(
                  [...ref.current.entries()].map(([route, info]) => ({
                      ...info,
                      route,
                  }))
              )
            : undefined;
        return ref.current;
    }, []);

    const scrollSaver = useCallback((path: string, state: ScrollStatus) => {
        ref.current = ref.current.set(path, {
            type: "scroll",
            state,
            y: window.scrollY,
            x: window.scrollX,
            scrollSize: document.body.scrollHeight,
        });
        return applyMiddleware(ref.current);
    }, []);

    const scroll = useCallback(
        (left: number, top: number, status: ScrollStatus) =>
            status === "scroll"
                ? setTimeout(() => window.scrollTo({ top, left, behavior }), 100)
                : undefined,
        [behavior]
    );

    useLayoutEffect(() => {
        window.history.scrollRestoration = "manual";
        const saved = ref.current.get(url.href);
        const save = () => {
            window.history.scrollRestoration = "auto";
            url.hash ? ref.current.set(url.href, { type: "anchor", id: url.hash }) : scrollSaver(url.href, "idle");
            return void applyMiddleware(ref.current)
        };
        if (!saved) {
            if (url.hash === "") scroll(0, 0, "scroll");
            return save;
        }
        if (saved.type === "anchor") return save;
        if (saved.type === "scroll" && saved.y < document.body.scrollHeight) scroll(saved.x, saved.y, "scroll");
    }, [url.href, root, scroll, ref]);

    useEffect(() => {
        if (url.hash === "") return;
        const id = url.hash.substring(1);
        waitFor(id, DEFAULT_TIMEOUT).then(() => {
            ref.current.set(url.href, { type: "anchor", id: url.hash });
            applyMiddleware(ref.current);
            scrollToId(id);
        });
    }, [url.hash]);

    const scrollBack = useCallback(
        async (id?: string, timeout: number = DEFAULT_TIMEOUT): Promise<boolean> => {
            if (id)
                return waitFor(id, timeout)
                    .catch(() => false)
                    .then(() => {
                        scrollToId(id);
                        return true;
                    });
            const item = ref.current.get(url.href);
            if (!item) return false;
            if (item.type === "anchor") {
                scrollToId(item.id);
                return true;
            }
            if (window.scrollY !== 0) return false;
            scroll(item.x, item.y, "scroll");
            return true;
        },
        [url.href]
    );

    return <scrollContext.Provider value={scrollBack}>{children}</scrollContext.Provider>;
};
