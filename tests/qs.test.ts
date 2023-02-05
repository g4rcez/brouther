import { describe, expect, it } from "vitest";
import { qsToString } from "../src/utils";

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
});
