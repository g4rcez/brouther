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
});
