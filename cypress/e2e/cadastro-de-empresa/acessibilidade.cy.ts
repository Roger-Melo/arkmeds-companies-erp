import { selectors } from "./shared/selectors";

describe("Acessibilidade", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");

    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

  it("deve ter label associado ao campo", () => {
    cy.get(selectors.cnpjGridContainer)
      .find("label")
      .should("exist")
      .and("have.attr", "for");
  });

  it("deve ter aria-invalid quando houver erro", () => {
    cy.get(selectors.cnpjInput).type("11111111111111");
    cy.get(selectors.cnpjInput).should("have.attr", "aria-invalid", "true");
  });

  it("deve ter aria-describedby para o helper text", () => {
    cy.get(selectors.cnpjInput).should("have.attr", "aria-describedby");
  });
});
