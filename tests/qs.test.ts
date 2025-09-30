import { describe, expect, it } from "vitest";
import { mapUrlToQueryStringRecord, qsToString, transformData } from "../src/utils/utils";
import { fromStringToValue } from "../src/utils/mappers";

const test = it.concurrent;
describe("Should test qsToString utils.ts", () => {
    test("should test null object", () => {
        expect(qsToString("/", null)).toBe("");
    });

    test("should test object with many depth levels", () => {
        const result = qsToString("/?a.b.c.d.e=string", {
            a: { b: { c: { d: { e: "string" } } } },
        });
        expect(result).toBe("a.b.c.d.e=string");
    });

    test("should test object with two depth levels", () => {
        const result = qsToString("/?pagination.limit=number&pagination.offset=number", {
            pagination: { XABLAU: 10, offset: 10 },
        });
        expect(result).toBe("pagination.offset=10");
        const result2 = qsToString("/?pagination.limit=number&pagination.offset=number", {
            pagination: { limit: 10, offset: 10 },
        });
        expect(result2).toBe("pagination.limit=10&pagination.offset=10");
    });

    test("should test object with multiple values using extra parsers", () => {
        const result = qsToString(
            "/?ids=number[]&date=date",
            {
                ids: [1, 2, 3, 4],
                date: new Date(1970, 0, 1),
            },
            {
                date: (d: Date) => d.toDateString(),
            }
        );
        expect(result).toBe("date=Thu%20Jan%2001%201970&ids=1%2C2%2C3%2C4");
    });

    test("should transform back to object", () => {
        const q = new URLSearchParams("numbers=1&numbers=2&numbers=3&numbers=4&id=5");
        transformData(q, mapUrlToQueryStringRecord("/?numbers=numbers[]&id=number", fromStringToValue));
    });
});
