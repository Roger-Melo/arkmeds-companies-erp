import { selectors } from "./cadastro-de-empresa/shared/selectors";

describe("Cadastro de Empresa - Formulário de Criação", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");
    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

  describe("Acessibilidade", () => {
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
});
