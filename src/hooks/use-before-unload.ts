import { useEffect } from "react";
import { useStableRef } from "./use-stable-ref";

export const useBeforeUnload = (fn: (event: BeforeUnloadEvent) => void) => {
    const func = useStableRef(fn);

    useEffect(() => {
        const closure = (e: BeforeUnloadEvent) => func.current(e);
        window.addEventListener("beforeunload", closure);
        return () => window.addEventListener("beforeunload", closure);
    }, []);
};
