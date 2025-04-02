/*
    @private
*/
import { useContext } from "react";
import { Context, ContextProps } from "../context";

export const useBrouther = (): ContextProps => {
    const ctx = useContext(Context);
    if (ctx === undefined) throw new Error("Context error");
    return ctx;
};
