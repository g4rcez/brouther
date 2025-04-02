import { useEffect } from "react";
import { useBrouther } from "../hooks/use-brouther";

export const Redirect = (props: { href: string; replace?: boolean }) => {
    const router = useBrouther();

    useEffect(() => {
        if (props.replace) return router.config.history.replace(props.href);
        return router.config.history.push(props.href);
    }, [props.href]);

    return null;
};
