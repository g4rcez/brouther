import { describe, expect, it } from "vitest";
import { transformParams, parsePath } from "../src/utils/mappers";

const test = it.concurrent;

describe("Should test mapper of paths", () => {
    test("As number", () => {
        const p = parsePath({ basename: "/", path: "/users/<id:number>/profile/<profileId:number>" });
        const params = p.regex.exec("/users/1/profile/5.2")?.groups ?? {};
        const mapped: any = transformParams(params);
        expect(mapped.id).toBe(1);
        expect(mapped.profileId).toBe(5.2);
    });

    test("Mixed params", () => {
        const p = parsePath({ basename: "/", path: "/date/<date:date>/:id" });
        const params = p.regex.exec("/date/1970-01-01/100")?.groups ?? {};
        const mapped: any = transformParams(params);
        expect(mapped.date).instanceof(Date);
        expect(mapped.id).toBe("100");
        expect(mapped.id.constructor.name).toBe("String");
        expect(mapped.date.toISOString()).toBe("1970-01-01T00:00:00.000Z");
    });

    test("As date", () => {
        const p = parsePath({ basename: "/", path: "/date/<date:date>/:id" });
        const params = p.regex.exec("/date/1970-01-01/10")?.groups ?? {};
        const mapped: any = transformParams(params);
        expect(mapped.date).instanceof(Date);
        expect(typeof mapped.id).toBe("string");
        expect(mapped.date.toISOString()).toBe("1970-01-01T00:00:00.000Z");
    });

    describe("Literal characters in route paths", () => {
        const matches = (path: string, url: string) => parsePath({ basename: "/", path }).regex.test(url);

        test("Dot matches only a dot", () => {
            expect(matches("/v1.0/users", "/v1.0/users")).toBe(true);
            expect(matches("/v1.0/users", "/v1x0/users")).toBe(false);
        });

        test("Pipe is not an alternation", () => {
            expect(matches("/a|b", "/a|b")).toBe(true);
            expect(matches("/a|b", "/b")).toBe(false);
        });

        test("Parentheses and dollar match themselves", () => {
            expect(matches("/files/(draft)", "/files/(draft)")).toBe(true);
            expect(matches("/price/$", "/price/$")).toBe(true);
        });

        test("Plus does not throw and matches itself", () => {
            expect(matches("/c++", "/c++")).toBe(true);
            expect(matches("/c++", "/c")).toBe(false);
        });

        test("Params still work next to literal characters", () => {
            const p = parsePath({ basename: "/", path: "/v1.0/<id:number>/:name" });
            const params = p.regex.exec("/v1.0/7/ana")?.groups ?? {};
            expect(transformParams(params)).toEqual({ id: 7, name: "ana" });
        });

        test("Trailing slash stays optional", () => {
            expect(matches("/users/", "/users")).toBe(true);
            expect(matches("/users/", "/users/")).toBe(true);
        });
    });
});
