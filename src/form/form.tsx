import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { ContextProps, useBrouther } from "../brouther/brouther";
import type { HttpMethods, PathFormat } from "../types";
import type { X } from "../types/x";
import { fromStringToValue } from "../utils/mappers";
import { createHref, has, mapUrlToQueryStringRecord, transformData } from "../utils/utils";
import { formDataToJson, formToJson, jsonToURLSearchParams } from "./form-data-api";

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
        exec: (url, _, ctx, response) => {
            const body = response.body;
            const path = url || ctx.href;
            const state = { url: path, body, headers: Object.fromEntries(response.headers) };
            ctx.navigation.push(path, state);
        },
    },
];

const fromResponse = async (ctx: ContextProps, response: Response) => {
    const location = response.headers.get("location");
    const status = response.status;
    const act = fromStatus.find((x) => x.min <= status && x.max >= status);
    if (act === undefined) return;
    return act.exec(location, status, ctx, response);
};

export const Form = forwardRef<HTMLFormElement, Props>(function InnerForm(props, externalRef) {
    const router = useBrouther();
    const method = (props.method || "get").toLowerCase() as HttpMethods;
    const innerRef = useRef<HTMLFormElement>(null);
    useImperativeHandle(externalRef, () => innerRef.current!);

    useEffect(() => {
        router.setState((prev) => ({ ...prev, actions: { state: "idle", loading: false } }));
    }, []);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        router.setLoading(true);
        event.preventDefault();
        event.persist();
        const form = event.currentTarget;
        if (props.onSubmit) {
            await props.onSubmit(event);
        }
        const page = router.page;
        if (method === "get" && page?.loader) {
            const bodyResult = parseFromEncType(props.encType, form);
            const qs = {
                ...fetchQs(router.location.search, page.originalPath),
                ...(typeof bodyResult === "string" ? JSON.parse(bodyResult) : formDataToJson(bodyResult)),
            };
            router.setLoading(false);
            if (router.page?.path) {
                const search = jsonToURLSearchParams(qs).toString();
                const href = createHref(router.location.pathname, search, router.location.hash, router.basename);
                return router.navigation.push(href);
            }
            return;
        }
        if (page?.actions && method !== "get") {
            const actions = await page.actions();
            if (has(actions, method)) {
                const fn = actions[method];
                const body = parseFromEncType(props.encType, form);
                const headers = new Headers();
                if (props.encType) headers.set("Content-Type", props.encType);
                router.setState((prev) => ({ ...prev, actions: { state: "submitting", loading: true } }));
                const response = await fn!({
                    event,
                    form: innerRef.current!,
                    links: router.config.links,
                    link: router.config.link,
                    paths: router.paths,
                    data: page.data ?? {},
                    path: router.href as PathFormat,
                    request: new Request(router.href, { body, method, headers }),
                    queryString: fetchQs(router.location.search, page.originalPath),
                } as any);
                router.setState((prev) => ({
                    ...prev,
                    actions: { state: "submitted", response, result: response.result, loading: false },
                }));
                return fromResponse(router, response);
            }
        }
    };
    return <form {...props} onSubmit={onSubmit} action={method} ref={innerRef} />;
});
