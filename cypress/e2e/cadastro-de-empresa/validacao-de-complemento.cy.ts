import { selectors } from "./shared/selectors";

describe("Validação de Complemento", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");
    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

  it("deve aceitar campo vazio (campo opcional)", () => {
    cy.get(selectors.complementoInput).focus();
    cy.get(selectors.complementoInput).blur();

    cy.get(selectors.complementoGridContainer)
      .find(".MuiFormHelperText-root")
      .should("not.have.class", "Mui-error")
      .and("contain.text", "Campo opcional");
  });

  it("deve ter limite máximo de 300 caracteres configurado", () => {
    cy.get(selectors.complementoInput).should("have.attr", "maxlength", "300");
  });

  it("deve impedir entrada de mais de 300 caracteres", () => {
    const texto300 = "a".repeat(300);
    const textoExtra = "bcdef";

    cy.get(selectors.complementoInput).type(texto300);
    cy.get(selectors.complementoInput).should("have.value", texto300);

    // Tenta digitar mais caracteres
    cy.get(selectors.complementoInput).type(textoExtra);

    // Verifica que ainda tem apenas 300 caracteres
    cy.get(selectors.complementoInput).should("have.value", texto300);
  });

  it("deve aceitar texto válido sem mostrar erro", () => {
    cy.get(selectors.complementoInput).type("Bloco A, Apartamento 301");
    cy.get(selectors.complementoInput).blur();

    cy.get(selectors.complementoGridContainer)
      .find(".MuiFormHelperText-root")
      .should("not.have.class", "Mui-error");
  });

  it("deve validar em tempo real (modo onChange)", () => {
    const texto300 = "a".repeat(300);

    cy.get(selectors.complementoInput).type(texto300);

    // Campo ainda deve estar válido com 300 caracteres
    cy.get(selectors.complementoGridContainer)
      .find(".MuiFormHelperText-root")
      .should("not.have.class", "Mui-error");
  });

  it("deve permitir caracteres especiais comuns em endereços", () => {
    cy.get(selectors.complementoInput).type("Apt. 123, Bl. 4-B, Fund./Térreo");
    cy.get(selectors.complementoInput).blur();

    cy.get(selectors.complementoGridContainer)
      .find(".MuiFormHelperText-root")
      .should("not.have.class", "Mui-error");
  });
});
