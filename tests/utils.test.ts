import { describe, expect, it } from "vitest";
import { setBasename, createHref, join, trailingPath, transformData } from "../src/utils/utils";

const test = it.concurrent;
describe("Should test utils.ts", () => {
    test("should test join urls", () => {
        expect(join("/basename", "a", "b", "c/d")).toBe("/basename/a/b/c/d");
        expect(join("////root", "aaa///")).toBe("/root/aaa");
        expect(join("", "root-path")).toBe("/root-path");
    });

    test("should test trailing paths", () => {
        expect(trailingPath("/////root////")).toBe("/root");
        expect(trailingPath("/root//a/")).toBe("/root//a");
        expect(trailingPath("/root//a//")).toBe("/root//a");
    });

    test("should test applyBasename", () => {
        expect(setBasename("/basename", "/basename/real-path")).toBe("/basename/real-path");
        expect(setBasename("/basename", "real-path")).toBe("/basename/real-path");
    });

    test("should test transformData using FormData", () => {
        const form = new FormData();
        form.set("sort", "asc");
        form.append("q", "name=r");
        form.append("q", "language=typescript");
        expect(
            transformData(
                form,
                new Map([
                    ["sort", String],
                    ["q", String],
                ])
            )
        ).toStrictEqual({
            sort: "asc",
            q: ["name=r", "language=typescript"],
        });
    });

    test("should test transformData using UrlSearchParams", () => {
        const form = new URLSearchParams();
        form.set("a", "users");
        form.append("q", "name=r");
        form.append("q", "type=lib");
        expect(
            transformData(
                form,
                new Map([
                    ["sort", String],
                    ["q", String],
                ])
            )
        ).toStrictEqual({
            a: "users",
            q: ["name=r", "type=lib"],
        });
    });

    test("should test createHref", () => {
        expect(createHref("/users", "a=1&b=2", "#getting-started", "/")).toBe("/users?a=1&b=2#getting-started");
        expect(createHref("/users", "a=1&b=2", "", "/")).toBe("/users?a=1&b=2");
        expect(createHref("/users", "", "#getting-started", "/")).toBe("/users#getting-started");
    });
});
