import { selectors } from "./shared/selectors";

describe("Validação de Logradouro", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");
    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

  it("deve mostrar erro de campo obrigatório quando vazio após interação", () => {
    cy.get(selectors.logradouroInput).type("a").clear();
    cy.get(selectors.logradouroInput).blur();

    cy.get(selectors.logradouroGridContainer)
      .find(".MuiFormHelperText-root")
      .should("contain.text", "Logradouro obrigatório")
      .and("have.class", "Mui-error");
  });

  it("deve aceitar Logradouro válido sem mostrar erro", () => {
    cy.get(selectors.logradouroInput).type("Rua das Flores, 123");
    cy.get(selectors.logradouroInput).blur();

    cy.get(selectors.logradouroGridContainer)
      .find(".MuiFormHelperText-root")
      .should("not.exist");
  });
});
