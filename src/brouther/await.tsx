import React, { useEffect, useState } from "react";

type AwaitProps<T extends Promise<any>> = {
    promise: T;
    loadingComponent?: React.ReactElement;
    children: (resolved: Awaited<T>) => React.ReactElement;
};

type PromiseResolved<T extends Promise<any>> = {
    resolved: Awaited<T> | undefined;
    error: boolean;
};

const resolvePromise = async <T extends Promise<any>>(
    promise: T
): Promise<
    | {
          resolved: Awaited<T>;
          error: false;
      }
    | {
          error: true;
          resolved: undefined;
      }
> => {
    try {
        const resolved = await promise;
        return { resolved, error: false };
    } catch (e) {
        return { resolved: undefined, error: true };
    }
};

const InnerAwait = <T extends Promise<any>>(props: AwaitProps<T>) => {
    const [data, setData] = useState<PromiseResolved<T> | undefined>(undefined);
    useEffect(() => {
        resolvePromise(props.promise).then(setData);
    }, [props.promise]);
    if (data === undefined) return props.loadingComponent;
    if (!data.error) return props.children(data.resolved!);
    return props.loadingComponent;
};

export const Await = <T extends Promise<any>>(props: AwaitProps<T>) => {
    return (
        <React.Suspense fallback={props.loadingComponent}>
            <InnerAwait {...props} />
        </React.Suspense>
    );
};
