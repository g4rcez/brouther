import React, { forwardRef } from "react";
import type { X } from "../types/x";
import type { HttpMethods } from "../types";
import { ContextProps, useRouter } from "../brouther/brouther";
import { has, mapUrlToQueryStringRecord, transformData } from "../utils/utils";
import { fromStringToValue } from "../utils/mappers";
import { formToJson } from "../utils/form-data-api";

type EncType = "application/x-www-form-urlencoded" | "multipart/form-data" | "json";

type Props = X.Hide<React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, "method" | "encType"> &
    Partial<{ method: HttpMethods; encType: EncType }>;

const parseFromEncType = (encType: EncType | undefined, form: HTMLFormElement) =>
    encType === "json" ? JSON.stringify(formToJson(form)) : new FormData(form);

const fetchQs = (s: string, originalPath: string) => {
    const search = new URLSearchParams(s);
    return transformData(search, mapUrlToQueryStringRecord(originalPath, fromStringToValue));
};

type FromStatus = {
    min: number;
    max: number;
    exec: (location: X.Nullable<string>, status: number, ctx: ContextProps, response: Response) => void;
};

const fromStatus: FromStatus[] = [
    {
        min: 300,
        max: 399,
        exec: (url, status, ctx, response) => {
            const body = response.body;
            const path = url || ctx.href;
            const state = { url: path, body, headers: Object.fromEntries(response.headers) };
            ctx.navigation.push(path, state);
        },
    },
];

const fromResponse = (ctx: ContextProps, response: Response) => {
    const location = response.headers.get("location");
    const status = response.status;
    const act = fromStatus.find((x) => x.min <= status && x.max >= status);
    if (act === undefined) return;
    return act.exec(location, status, ctx, response);
};

export const Form = forwardRef<HTMLFormElement, Props>(function InnerForm(props, externalRef) {
    const router = useRouter();
    const method = (props.method || "get").toLowerCase() as HttpMethods;
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        await props.onSubmit?.(event);
        const page = router.page;
        if (method === "get" && page?.loader) {
            return fromResponse(
                router,
                await page.loader({
                    paths: router.paths,
                    data: page.data ?? {},
                    request: new Request(router.href),
                    queryString: fetchQs(router.location.search, page.originalPath),
                })
            );
        }
        if (page?.actions && method !== "get") {
            const actions = await page.actions();
            if (has(actions, method)) {
                const fn = actions[method];
                const body = parseFromEncType(props.encType, form);
                return fromResponse(
                    router,
                    await fn!({
                        paths: router.paths,
                        data: page.data ?? {},
                        request: new Request(router.href, { body, method }),
                        queryString: fetchQs(router.location.search, page.originalPath),
                    })
                );
            }
        }
    };

    return <form {...props} onSubmit={onSubmit} action={method} ref={externalRef} />;
});
