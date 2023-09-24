import React, { useEffect, useState } from "react";

type AwaitProps<T extends Promise<any>> = {
    promise: T;
    loadingComponent?: React.ReactElement;
    children: (resolved: Awaited<T>) => React.ReactElement;
    errorComponent?: (error: any) => React.ReactElement;
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

    useEffect(() => void resolvePromise(props.promise).then(setData), [props.promise]);

    if (data === undefined) return props.loadingComponent;
    if (!data.error) return props.children(data.resolved!);
    if (data.error && props.errorComponent) return props.errorComponent(data!.error);
    return props.loadingComponent;
};

export const Await = <T extends Promise<any>>(props: AwaitProps<T>) => (
    <React.Suspense fallback={props.loadingComponent}>
        <InnerAwait
            errorComponent={props.errorComponent}
            promise={props.promise}
            loadingComponent={props.loadingComponent}
            children={props.children}
        />
    </React.Suspense>
);
