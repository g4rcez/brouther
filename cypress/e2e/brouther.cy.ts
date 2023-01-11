describe("template spec", () => {
    before(() => cy.visit("/"));

    const testLinkSelector = (selector: string, path: string) => {
        cy.get(selector).click();
        cy.url().should("equal", `http://localhost:5173${path}`);
    };

    it("passes", () => {
        cy.get("nav>ul>li>a[href='/']");

        const secondLink = "/user/TRY_TO_CHANGE_URL/address/?sort=asc";
        testLinkSelector(`nav>ul>li:nth-child(2)>a[href='${secondLink}']`, secondLink);

        const third = "/users?id=1";
        testLinkSelector(`nav>ul>li:nth-child(3)>a[href='${third}']`, third);

        cy.get("nav>ul>li>a[href='/404']").click();
        cy.get("div.error");
    });
});
