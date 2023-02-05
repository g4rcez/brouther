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

    test("should transform back to object", () => {
        const q = new URLSearchParams("numbers=1&numbers=2&numbers=3&numbers=4&id=5");
        transformData(q, mapUrlToQueryStringRecord("/?numbers=numbers[]&id=number", fromStringToValue));
    });
});
