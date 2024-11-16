import React from "react";
import { useLoadingState, useQueryStringState } from "../../../../src";
import { Form, jsonResponse, LoaderProps, useDataLoader } from "../../exports";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const loader = async (args: LoaderProps) => {
    const cep = (args.queryString as any).cep || "30260-070";
    const now = performance.now();
    await sleep(4000);
    console.log("LOADER JSON ->", cep, performance.now() - now);
    return jsonResponse({ cep });
};

const debounce = (fn: Function, ms: number = 0) => {
    let timeoutId: NodeJS.Timeout;
    return function (...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), ms);
    };
};

export default function LoaderPage() {
    const data = useDataLoader<typeof loader>();
    const [q, setQ] = useQueryStringState<any>();
    const loading = useLoadingState()
    return (
        <div className="h-full flex flex-col gap-6 items-center justify-center w-full">
            <p>{loading ? "Loading..." : ""}</p>
            <Form method="get" encType="json" className="flex gap-4">
                <input name="cep" className="bg-white border p-1" />
                <button type="submit">Test</button>
            </Form>
            <input
                className="bg-white border p-1"
                placeholder="Debounce test"
                onChange={debounce((e: React.ChangeEvent<HTMLInputElement>) => {
                    setQ((prev: any) => ({ ...prev, query: e.target.value }));
                    console.log("After 2 seconds");
                }, 1200)}
            />
            <div>{JSON.stringify({ data, q }, null, 4)}</div>
        </div>
    );
}
