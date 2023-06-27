import React, { useCallback } from "react";
import { useHref } from "./brouther";

export function usePrevious<T>(value: T) {
    const ref = React.useRef(value);
    React.useEffect(() => void (ref.current = value), [value]);
    return ref.current;
}

type State = { panic: boolean; error: Error | null };

type Props = React.PropsWithChildren<{
    state: any;
    fallback: React.FC;
    onPanic: (panic: Error | null) => void;
}>;

class HistoryBoundary extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
        this.state = { panic: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { panic: !!error, error };
    }

    componentDidCatch(e: Error) {
        this.props.onPanic(e);
    }

    render() {
        if (!this.state.panic) return this.props.children;
        if (this.state.panic && this.props.fallback) {
            return <this.props.fallback />;
        }
        throw this.state.error;
    }
}

export const CatchError: React.FC<
    React.PropsWithChildren<{
        state: any;
        fallback: React.FC;
        setError: (e: Error | null) => void;
    }>
> = ({ children, setError, state, fallback }) => {
    const path = useHref();
    const previousPathname = usePrevious(path);
    const [id, setId] = React.useState<number>(1);
    const [panic, setPanic] = React.useState<Error | null>(null);

    const setErrorPanic = useCallback(
        (e: Error | null) => {
            setPanic(e);
            setError(e);
        },
        [setError]
    );

    React.useEffect(() => {
        if (panic && previousPathname !== path) {
            setId(Math.random);
            setErrorPanic(null);
        }
    }, [panic, previousPathname, path]);

    return (
        <HistoryBoundary fallback={fallback} key={id} state={state} onPanic={setErrorPanic}>
            {children}
        </HistoryBoundary>
    );
};
