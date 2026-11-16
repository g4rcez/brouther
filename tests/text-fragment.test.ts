import { beforeAll, describe, expect, test } from "vitest";
import { parseTextFragment } from "../src/utils/text-fragment";

describe("Should test parseTextFragment", () => {
    beforeAll(() => {
        (globalThis as any).document = { fragmentDirective: {} };
    });

    test("Should parse prefix, text and suffix", () => {
        expect(parseTextFragment("http://localhost/#:~:text=pre-,mid,-suf")).toEqual([
            { text: "mid", prefix: "pre", suffix: "suf" },
        ]);
    });

    test("Should parse prefix and suffix with spaces", () => {
        expect(parseTextFragment("http://localhost/#:~:text=two%20words-,mid,-after%20this")).toEqual([
            { text: "mid", prefix: "two words", suffix: "after this" },
        ]);
    });

    test("Should parse only prefix", () => {
        expect(parseTextFragment("http://localhost/#:~:text=pre-,mid")).toEqual([{ text: "mid", prefix: "pre" }]);
    });

    test("Should parse only suffix", () => {
        expect(parseTextFragment("http://localhost/#:~:text=mid,-suf")).toEqual([{ text: "mid", suffix: "suf" }]);
    });

    test("Should parse plain text", () => {
        expect(parseTextFragment("http://localhost/#:~:text=plain")).toEqual([{ text: "plain" }]);
    });

    test("Should parse multiple fragments", () => {
        expect(parseTextFragment("http://localhost/#:~:text=a&text=pre-,b,-suf")).toEqual([
            { text: "a" },
            { text: "b", prefix: "pre", suffix: "suf" },
        ]);
    });
});
