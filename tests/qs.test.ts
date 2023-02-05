import { describe, expect, it } from "vitest";
import { mapUrlToQueryStringRecord, qsToString, transformData } from "../src/utils";
import { fromStringToValue } from "../src/mappers";

const test = it.concurrent;
describe("Should test qsToString utils.ts", () => {
    test("should test null object", () => {
        expect(qsToString("/", null)).toBe("");
    });

    test("should test object with dates", () => {
        const result = qsToString("/?dates=date[]", {
            dates: [new Date(1970, 0, 1), new Date(1970, 0, 1)],
        });
        expect(result).toBe("dates=1970-01-01T03%253A00%253A00.000Z&dates=1970-01-01T03%253A00%253A00.000Z");
    });

    test("should transform back to object", () => {
        const q = new URLSearchParams("date=2023-02-05T06%253A14%253A48.668Z&date=1970-01-01T03%253A00%253A00.000Z&id=1");
        transformData(q, mapUrlToQueryStringRecord("/?date=date[]&id=number", fromStringToValue));
    });
});
