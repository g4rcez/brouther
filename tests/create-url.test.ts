import { describe, expect, test } from "vitest";
import { mergeUrlEntities } from "../src/utils/utils";

describe("Should test mergeUrlEntities utility", () => {
    test("Should create a simple url", () => {
        const url = mergeUrlEntities("/", {}, {}, undefined, []);
        expect(url).toBe("/");
    });

    test("Should create a params url", () => {
        const url = mergeUrlEntities("/:id", { id: "1" }, {}, undefined, []);
        expect(url).toBe("/1");
    });

    test("Should create a query string url", () => {
        const url = mergeUrlEntities("/?name=string", {}, { name: "name" }, undefined, []);
        expect(url).toBe("/?name=name");
    });

    test("Should create a query string url", () => {
        const url = mergeUrlEntities("/?name=string", {}, { name: "name" }, undefined, []);
        expect(url).toBe("/?name=name");
    });

    test("Should create a text-fragment url with hash", () => {
        const url = mergeUrlEntities("/#hash", {}, {}, undefined, [{ text: "test" }]);
        expect(url).toBe("/#hash:~:text=test");
    });

    test("Should create a text-fragment url without hash", () => {
        const url = mergeUrlEntities("/", {}, {}, undefined, [{ text: "test" }]);
        expect(url).toBe("/#:~:text=test");
    });

    test("Should create multiple text-fragment url", () => {
        const url = mergeUrlEntities("/", {}, {}, undefined, [{ text: "test" }, { text: "fragments" }]);
        expect(url).toBe("/#:~:text=test&text=fragments");
    });

    test("Should create a text-fragment using prefix", () => {
        const url = mergeUrlEntities("/", {}, {}, undefined, [{ text: "test", prefix: "property" }]);
        expect(url).toBe("/#:~:text=property-,test");
    });

    test("Should create a text-fragment using suffix", () => {
        const url = mergeUrlEntities("/", {}, {}, undefined, [{ text: "test", suffix: "property" }]);
        expect(url).toBe("/#:~:text=test,-property");
    });

    test("Should create a text-fragment using both prefix and suffix", () => {
        const url = mergeUrlEntities("/", {}, {}, undefined, [{ text: "test", prefix: "prefix", suffix: "suffix" }]);
        expect(url).toBe("/#:~:text=prefix-,test,-suffix");
    });
});
