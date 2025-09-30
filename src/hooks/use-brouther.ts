/*
    @private
*/
import { useContext } from "react";
import { Context, ContextProps } from "../context";

export const useBrouther = (): Omit<ContextProps, "loaderDataPromise"> => {
    const ctx = useContext(Context);
    if (!ctx) throw new Error("Context is undefined");
    return ctx;
};
