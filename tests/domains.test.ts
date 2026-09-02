import { createMemoryHistory } from "history";
import React from "react";
import { describe, expect, it } from "vitest";
import { createRouterMap, lazyRoute, type Route } from "../src";
import { matchesDomain } from "../src/brouther/brouther";

const staticDomains = ["app.example.com"] satisfies NonNullable<Route["domains"]>;
const dynamicDomains = (() => ["admin.example.com"]) satisfies NonNullable<Route["domains"]>;

describe("matchesDomain", () => {
    it("allows routes without domain restrictions", () => {
        expect(matchesDomain(undefined, "app.example.com")).toBe(true);
    });

    it("matches an allowed subdomain", () => {
        expect(matchesDomain(staticDomains, "app.example.com")).toBe(true);
        expect(matchesDomain(["admin.example.com"], "app.example.com")).toBe(false);
    });

    it("accepts a function that provides allowed domains", () => {
        expect(matchesDomain(dynamicDomains, "admin.example.com")).toBe(true);
    });

    it("does not match an empty domain list or an unavailable hostname", () => {
        expect(matchesDomain([], "app.example.com")).toBe(false);
        expect(matchesDomain(["app.example.com"], undefined)).toBe(false);
    });

    it("preserves domains when creating a mapped router", () => {
        const router = createRouterMap(
            {
                app: {
                    path: "/",
                    element: React.createElement("div"),
                    domains: ["app.example.com"],
                },
                admin: lazyRoute("/admin", async () => ({ default: () => React.createElement("div") }), {
                    domains: () => ["admin.example.com"],
                }),
            } as const,
            "/",
            { history: () => createMemoryHistory() }
        );

        expect(router.config.routes.map((route) => route.domains)).toStrictEqual([
            ["app.example.com"],
            expect.any(Function),
        ]);
    });
});
