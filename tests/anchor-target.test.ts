import { describe, expect, test } from "vitest";
import { fetchTarget } from "../src/utils/utils";

describe("Should test the anchor target", () => {
    test("Should test same origin", () => {
        expect(fetchTarget(true, "http://localhost:3000/", "http://localhost:3000")).toBe(undefined);
    });

    test("Should test different origin", () => {
        expect(fetchTarget(true, "https://example.com", "http://localhost:3000")).toBe("_blank");
        expect(fetchTarget(true, "https://example.com", "http://localhost:3000")).toBe("_blank");
    });

    test("Should test different origin but without openExternalLinksInTabs", () => {
        expect(fetchTarget(false, "https://example.com", "http://localhost:3000")).not.toBe("_blank");
        expect(fetchTarget(false, "https://example.com", "http://localhost:3000")).not.toBe("_blank");
    });
});
