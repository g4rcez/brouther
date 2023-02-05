import { describe, expect, it } from "vitest";
import { mapUrlToQueryStringRecord, qsToString, transformData } from "../src/utils";
import { fromStringToValue } from "../src/mappers";

const test = it.concurrent;
describe("Should test qsToString utils.ts", () => {
    test("should test null object", () => {
        expect(qsToString("/", null)).toBe("");
    });

    test("should test object with dates", () => {
        const result = qsToString("/?numbers=numbers[]", {
            numbers: [1, 2, 3, 4],
        });
        expect(result).toBe("numbers=1&numbers=2&numbers=3&numbers=4");
    });

    test("should test object with multiple values using extra parsers", () => {
        const result = qsToString(
            "/?ids=numbers[]&date=date",
            {
                ids: [1, 2, 3, 4],
                date: new Date(1970, 0, 1),
            },
            {
                date: (d: Date) => d.toDateString(),
            }
        );
        expect(result).toBe("date=Thu+Jan+01+1970&ids=1&ids=2&ids=3&ids=4");
    });

    test("should transform back to object", () => {
        const q = new URLSearchParams("numbers=1&numbers=2&numbers=3&numbers=4&id=5");
        transformData(q, mapUrlToQueryStringRecord("/?numbers=numbers[]&id=number", fromStringToValue));
    });
});
