import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useRef } from "react";
import { useURL } from "../hooks/use-url";
import { useBrouther } from "../hooks/use-brouther";

type ScrollStatus = "idle" | "scroll";

type Behavior = "auto" | "smooth";

type ScrollInformation =
    | {
          x: number;
          y: number;
          type: "scroll";
          createdAt: Date;
          scrollSize: number;
          state: ScrollStatus;
      }
    | {
          id: string;
          type: "anchor";
          createdAt: Date;
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

const getScroll = () => ({
    y: window.scrollY,
    x: window.scrollX,
});

const compare = (a: ScrollInformation, b: ScrollInformation): boolean => {
    if (a.type !== b.type) {
        return false;
    }
    if (a.type === "scroll" && b.type === "scroll") {
        return a.x === b.x && a.y === b.y;
    }
    if (a.type === "anchor" && b.type === "anchor") {
        return a.id === b.id;
    }
    return false;
};

const fetchScrollInfo = (): ScrollInformation => ({
    state: "idle",
    type: "scroll",
    x: getScroll().x,
    y: getScroll().y,
    createdAt: new Date(),
    scrollSize: document.documentElement.scrollHeight,
});

const getInitialRef = (url: URL, initial?: RawScrollInfo[]): Map<string, ScrollInformation> => {
    if (initial) {
        return new Map<string, ScrollInformation>(initial.map(({ route, ...state }) => [route, state]));
    }
    return new Map<string, ScrollInformation>();
};

export const Scroll = ({ children, initialState, middleware, root = document.documentElement, behavior = "smooth" }: PropsWithChildren<Props>) => {
    const url = useURL();
    const ref = useRef(getInitialRef(url, initialState));
    const brouther = useBrouther();

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

    const scrollToElement = useCallback(
        async (id?: string, timeout: number = DEFAULT_TIMEOUT): Promise<boolean> => {
            try {
                if (!id) return false;
                await waitFor(id, timeout);
                scrollToId(id);
                ref.current.set(url.href, { type: "anchor", id, createdAt: new Date() });
                applyMiddleware(ref.current);
                return true;
            } catch (e) {
                return false;
            }
        },
        [url.href, applyMiddleware]
    );

    useEffect(() => {
        return brouther.config.history.listen(() => {
            const x = fetchScrollInfo();
            ref.current.set(url.pathname, x);
        });
    }, [behavior]);

    useEffect(() => {
        const id = url.pathname;
        const item = ref.current.get(id);
        if (item) {
            const i = setInterval(() => {
                if (item.type === "scroll") {
                    if (document.documentElement.scrollHeight >= item.scrollSize) {
                        window.scrollTo({ top: item.y, left: item.x, behavior });
                        ref.current.delete(id);
                        clearInterval(i);
                    }
                }
            }, 100);
            return () => clearInterval(i);
        }
    }, [url, behavior]);

    return <scrollContext.Provider value={scrollToElement}>{children}</scrollContext.Provider>;
};
