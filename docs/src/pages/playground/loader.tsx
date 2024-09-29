import React, { Fragment } from "react";
import { useLoadingState, useQueryStringState } from "../../../../src/brouther/brouther";
import { Form, jsonResponse, LoaderProps, useDataLoader } from "../../exports";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const loader = async (args: LoaderProps) => {
    const cep = (args.queryString as any).cep || "30260-070";
    await sleep(4000);
    console.log("JSON ->", cep);
    return jsonResponse({ cep });
};

const debounce = (fn: Function, ms = 0) => {
    let timeoutId: NodeJS.Timeout;
    return function (...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
};

export default function LoaderPage() {
    const data = useDataLoader<typeof loader>();
    const loading = useLoadingState();
    const [q, setQ] = useQueryStringState();
    return (
        <div className="h-full flex flex-col gap-6 items-center justify-center w-full">
            {loading ? (
                "Loading..."
            ) : (
                <Fragment>
                    {" "}
                    <Form method="get" encType="json" className="flex gap-4">
                        <input name="cep" className="bg-white border p-1" />
                        <button type="submit">Test</button>
                    </Form>
                    <input
                        className="bg-white border p-1"
                        placeholder="Debounce test"
                        onChange={debounce((e: React.ChangeEvent<HTMLInputElement>) => {
                            setQ({ query: e.target.value });
                            console.log("After 2 seconds");
                        }, 1200)}
                    />
                    <div>{JSON.stringify(data, null, 4)}</div>
                </Fragment>
            )}
        </div>
    );
}
