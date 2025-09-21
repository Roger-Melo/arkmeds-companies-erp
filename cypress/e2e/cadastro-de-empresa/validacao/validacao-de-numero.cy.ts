import { selectors } from "../shared/selectors";

describe("Validação de Número", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");
    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

  it("deve aceitar campo vazio (campo opcional)", () => {
    cy.get(selectors.numeroInput).focus();
    cy.get(selectors.numeroInput).blur();

    cy.get(selectors.numeroGridContainer)
      .find(".MuiFormHelperText-root")
      .should("not.have.class", "Mui-error");
  });

  it("deve aceitar números inteiros positivos", () => {
    cy.get(selectors.numeroInput).type("123");
    cy.get(selectors.numeroInput).blur();

    cy.get(selectors.numeroGridContainer)
      .find(".MuiFormHelperText-root")
      .should("not.have.class", "Mui-error");
  });

  it("deve aceitar zero", () => {
    cy.get(selectors.numeroInput).type("0");
    cy.get(selectors.numeroInput).blur();

    cy.get(selectors.numeroGridContainer)
      .find(".MuiFormHelperText-root")
      .should("not.have.class", "Mui-error");
  });

  it("deve aceitar S/N em maiúsculas", () => {
    cy.get(selectors.numeroInput).type("S/N");
    cy.get(selectors.numeroInput).blur();

    cy.get(selectors.numeroGridContainer)
      .find(".MuiFormHelperText-root")
      .should("not.have.class", "Mui-error");
  });

  it("deve aceitar s/n em minúsculas", () => {
    cy.get(selectors.numeroInput).type("s/n");
    cy.get(selectors.numeroInput).blur();

    cy.get(selectors.numeroGridContainer)
      .find(".MuiFormHelperText-root")
      .should("not.have.class", "Mui-error");
  });

  it("deve mostrar erro para números negativos", () => {
    cy.get(selectors.numeroInput).type("-10");
    cy.get(selectors.numeroInput).blur();

    cy.get(selectors.numeroGridContainer)
      .find(".MuiFormHelperText-root")
      .should("contain.text", "Não pode ser negativo")
      .and("have.class", "Mui-error");
  });

  it("deve mostrar erro para números decimais", () => {
    cy.get(selectors.numeroInput).type("10.5");
    cy.get(selectors.numeroInput).blur();

    cy.get(selectors.numeroGridContainer)
      .find(".MuiFormHelperText-root")
      .should("contain.text", "Não pode ser decimal")
      .and("have.class", "Mui-error");
  });

  it("deve mostrar erro para texto não numérico", () => {
    cy.get(selectors.numeroInput).type("abc");
    cy.get(selectors.numeroInput).blur();

    cy.get(selectors.numeroGridContainer)
      .find(".MuiFormHelperText-root")
      .should("contain.text", "Deve ser um número ou 'S/N'")
      .and("have.class", "Mui-error");
  });

  it("deve validar em tempo real (modo onChange)", () => {
    // Digita um número inválido
    cy.get(selectors.numeroInput).type("-5");

    // Sem precisar blur, já deve mostrar erro
    cy.get(selectors.numeroGridContainer)
      .find(".MuiFormHelperText-root")
      .should("contain.text", "Não pode ser negativo")
      .and("have.class", "Mui-error");

    // Corrige para um número válido
    cy.get(selectors.numeroInput).clear().type("5");

    // Erro deve sumir
    cy.get(selectors.numeroGridContainer)
      .find(".MuiFormHelperText-root")
      .should("not.have.class", "Mui-error");
  });
});
