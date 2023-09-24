import React, { useEffect, useState } from "react";

type AwaitProps<T extends Promise<any>> = {
    promise: T;
    loadingElement?: React.ReactElement;
    errorElement?: (error: any) => React.ReactElement;
    children: (resolved: Awaited<T>) => React.ReactElement;
};

type PromiseResolved<T extends Promise<any>> = { resolved: Awaited<T> | undefined; error: boolean };

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

    if (data === undefined) return props.loadingElement;
    if (!data.error) return props.children(data.resolved!);
    if (data.error && props.errorElement) return props.errorElement(data!.error);
    return props.loadingElement;
};

export const Await = <T extends Promise<any>>(props: AwaitProps<T>) => (
    <React.Suspense fallback={props.loadingElement}>
        <InnerAwait errorElement={props.errorElement} promise={props.promise} loadingElement={props.loadingElement} children={props.children} />
    </React.Suspense>
);
