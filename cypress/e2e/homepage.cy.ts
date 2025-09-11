describe("Homepage", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("CompaniesList component should render companies from the API", () => {
    cy.get('[data-cy="companiesList"]').should("be.visible");
    cy.get('[data-cy="companiesList"] li').should("have.length.greaterThan", 0);

    const companies = [
      "Premium Café do Rafael Ltda",
      "Delicioso Lanches da Clara Ltda",
      "Popular Pão do Paulo Ltda",
    ];

    companies.forEach((company) => {
      cy.get('[data-cy="companiesList"]').should("contain.text", company);
    });
  });
});
