import { selectors } from "../../shared/selectors";

describe("Validação de Nome Fantasia", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");
    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

  it("deve mostrar erro de campo obrigatório quando vazio após interação", () => {
    cy.get(selectors.nomeFantasiaInput).type("a").clear();
    cy.get(selectors.nomeFantasiaInput).blur();

    cy.get(selectors.nomeFantasiaGridContainer)
      .find(".MuiFormHelperText-root")
      .should("contain.text", "Nome Fantasia obrigatório")
      .and("have.class", "Mui-error");
  });

  it("deve ter limite máximo de 100 caracteres configurado", () => {
    cy.get(selectors.nomeFantasiaInput).should("have.attr", "maxlength", "100");
  });

  it("deve impedir entrada de mais de 100 caracteres", () => {
    const texto100 = "a".repeat(100);
    const textoExtra = "bcdef";

    cy.get(selectors.nomeFantasiaInput).type(texto100);
    cy.get(selectors.nomeFantasiaInput).should("have.value", texto100);

    cy.get(selectors.nomeFantasiaInput).type(textoExtra);
    cy.get(selectors.nomeFantasiaInput).should("have.value", texto100);
  });

  it("deve aceitar Nome Fantasia válido sem mostrar erro", () => {
    cy.get(selectors.nomeFantasiaInput).type("Empresa Fantasia LTDA");
    cy.get(selectors.nomeFantasiaInput).blur();

    cy.get(selectors.nomeFantasiaGridContainer)
      .find(".MuiFormHelperText-root")
      .should("not.exist");
  });
});
