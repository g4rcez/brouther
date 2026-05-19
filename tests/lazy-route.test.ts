import React from "react";
import { describe, expect, it, vi } from "vitest";
import { jsonResponse } from "../src/brouther/brouther-response";
import { lazyRoute } from "../src/router/router";

describe("lazyRoute", () => {
    it("defers loading the route module until loader or actions are used", async () => {
        const loader = vi.fn(() => jsonResponse({ ok: true }));
        const action = vi.fn(() => jsonResponse({ ok: true }));
        const actions = vi.fn(() => ({ post: action }));
        const loadRoute = vi.fn(async () => ({
            default: () => React.createElement("div"),
            loader,
            actions,
        }));

        const route = lazyRoute("/lazy", loadRoute);

        expect(loadRoute).not.toHaveBeenCalled();

        await route.loader({} as never);

        expect(loadRoute).toHaveBeenCalledTimes(1);
        expect(loader).toHaveBeenCalledTimes(1);

        await route.actions();

        expect(loadRoute).toHaveBeenCalledTimes(1);
        expect(actions).toHaveBeenCalledTimes(1);
    });
});
