describe("Should test Brouther behaviors", () => {
    before(() => cy.visit("/"));

    it("Should redirect to correct URL", () => {
        cy.get("nav>ul>li>a[href='/']");
        cy.get("nav>ul>li>a[href='/users?sort=desc']").click().url().should("be.equal", "http://localhost:5173/users?sort=desc");
        cy.get("#users>li>a").first().should("contain.text", "Spider Man");

        cy.visit("/users?sort=asc");
        cy.get("#users>li>a").first().should("contain.text", "Batman");
    });
});
