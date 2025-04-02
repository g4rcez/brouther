import { useEffect, useRef } from "react";

export const useStableRef = <V extends any>(value: V) => {
    const v = useRef(value);
    useEffect(() => {
        v.current = value;
    }, [value]);
    return v;
};
