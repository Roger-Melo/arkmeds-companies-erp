import { selectors } from "../shared/selectors";

describe("Validação de Estado", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");
    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

  it("deve mostrar erro de campo obrigatório quando vazio após interação", () => {
    cy.get(selectors.estadoInput).type("a").clear();
    cy.get(selectors.estadoInput).blur();

    cy.get(selectors.estadoGridContainer)
      .find(".MuiFormHelperText-root")
      .should("contain.text", "Estado obrigatório")
      .and("have.class", "Mui-error");
  });

  it("deve ter limite máximo de 2 caracteres configurado", () => {
    cy.get(selectors.estadoInput).should("have.attr", "maxlength", "2");
  });

  it("deve impedir entrada de mais de 2 caracteres", () => {
    cy.get(selectors.estadoInput).type("ABC");
    cy.get(selectors.estadoInput).should("have.value", "AB");
  });

  it("deve aceitar Estado válido sem mostrar erro", () => {
    cy.get(selectors.estadoInput).type("SP");
    cy.get(selectors.estadoInput).blur();

    cy.get(selectors.estadoGridContainer)
      .find(".MuiFormHelperText-root")
      .should("not.have.class", "Mui-error")
      .and("contain.text", "Digite a sigla do estado (UF)");
  });

  it("deve converter texto para maiúsculas automaticamente", () => {
    cy.get(selectors.estadoInput).type("sp");
    cy.get(selectors.estadoInput).should("have.value", "SP");
  });
});
