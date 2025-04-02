import { useEffect, useState } from "react";
import { InferLoader } from "../brouther/brouther-response";
import { X } from "../types/x";
import { UncaughtDataLoader } from "../utils/errors";
import { useBrouther } from "./use-brouther";

const useLoader = <T extends unknown>(): X.Nullable<T> => useBrouther().loaderData as never;

const defaultLoaderParser = async (r: Response) => {
    const json = await r.json();
    return json;
};

type DataLoader = (a: Response) => any;

type Fn = (...a: any[]) => any;

export function useDataLoader<T extends DataLoader>(fn: T): ReturnType<T> | null;

export function useDataLoader<T extends Fn>(): Awaited<InferLoader<T>> | null;

export function useDataLoader<T extends DataLoader>(fn: (response: Response) => Promise<ReturnType<T>> = defaultLoaderParser) {
    const data = useLoader();
    const [state, setState] = useState(() => {
        if (data instanceof Response) {
            if ((data as any).result) {
                return (data as any).result;
            }
        }
        return data;
    });
    useEffect(() => {
        const async = async () => {
            if (data instanceof Response) {
                if ((data as any).result) {
                    return (data as any).result;
                }
                return fn(data);
            }
            return null;
        };
        async()
            .then(setState)
            .catch((error) => {
                throw new UncaughtDataLoader(error);
            });
    }, [data]);
    return state;
}
