import { describe, it } from "vitest";
import { createLink } from "../src/utils";

const test = it.concurrent;

describe("Should test links creation", () => {
    test("Should test link creation using custom parsers", () => {
        const links = createLink([
            {
                path: "/users/:id?sort=string&date=date",
                element: null as any,
                id: "users",
            },
        ]);
        expect(
            links(
                "/users/:id?sort=string&date=date",
                { id: "1" },
                { sort: "asc", date: new Date(1970, 0, 1) },
                {
                    sort: (a) => a.toLocaleUpperCase(),
                    date: (d) => {
                        const date = new Date(decodeURIComponent(d));
                        const month = date.getMonth() + 1;
                        const day = date.getDate().toString().padStart(2, "0");
                        return `${date.getFullYear()}-${month.toString().padStart(2, "0")}-${day}`;
                    },
                }
            )
        ).toBe("/users/1?date=1970-01-01&sort=ASC");
    });
});
