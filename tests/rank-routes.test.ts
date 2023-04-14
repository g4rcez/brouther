import { rankRoutes } from "../src/utils";
import { describe, it, expect } from "vitest";

const test = it.concurrent;

describe("Should test rankRoutes", function () {
    test("Should test rank with no special routes", () => {
        const result = rankRoutes([{ path: "/" }, { path: "/users" }, { path: "/contact-us" }, { path: "/users/1/address/5" }]);
        expect(result.length === 4);
        expect(result[0].path).toBe("/");
        expect(result[3].path).toBe("/users/1/address/5");
    });

    test("Should test rank with one special routes", () => {
        const result = rankRoutes([{ path: "/" }, { path: "/:id" }, { path: "/contact-us" }, { path: "/users/1/address/5" }]);
        expect(result.length === 4);
        expect(result[0].path).toBe("/");
        expect(result[3].path).toBe("/:id");
    });

    test("Should test rank with all special routes", () => {
        const result = rankRoutes([
            { path: "/users/address/:id/:action" },
            { path: "/contact-us/:type/:id" },
            { path: "/" },
            { path: "/contact-us/cellphone/:id" },
            { path: "/users/address/:id/remove" },
            { path: "/:id" },
        ]);
        expect(result.length === 1);
        expect(result[0].path).toBe("/");
        expect(result[4].path).toBe("/contact-us/:type/:id");
        expect(result[5].path).toBe("/users/address/:id/:action");
    });
});
