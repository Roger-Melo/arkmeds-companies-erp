import { selectors } from "../shared/selectors";

describe("Validação de Município", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");
    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

  it("deve mostrar erro de campo obrigatório quando vazio após interação", () => {
    cy.get(selectors.municipioInput).type("a").clear();
    cy.get(selectors.municipioInput).blur();

    cy.get(selectors.municipioGridContainer)
      .find(".MuiFormHelperText-root")
      .should("contain.text", "Município obrigatório")
      .and("have.class", "Mui-error");
  });

  it("deve ter limite máximo de 100 caracteres configurado", () => {
    cy.get(selectors.municipioInput).should("have.attr", "maxlength", "100");
  });

  it("deve impedir entrada de mais de 100 caracteres", () => {
    const texto100 = "a".repeat(100);
    const textoExtra = "bcdef";

    cy.get(selectors.municipioInput).type(texto100);
    cy.get(selectors.municipioInput).should("have.value", texto100);

    cy.get(selectors.municipioInput).type(textoExtra);
    cy.get(selectors.municipioInput).should("have.value", texto100);
  });

  it("deve aceitar Município válido sem mostrar erro", () => {
    cy.get(selectors.municipioInput).type("São Paulo");
    cy.get(selectors.municipioInput).blur();

    cy.get(selectors.municipioGridContainer)
      .find(".MuiFormHelperText-root")
      .should("not.exist");
  });
});
