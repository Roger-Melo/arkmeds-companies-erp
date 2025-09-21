import { selectors } from "./shared/selectors";

describe("Validação de Razão Social", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");
    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

  it("deve mostrar erro de campo obrigatório quando vazio após interação", () => {
    cy.get(selectors.razaoSocialInput).type("a").clear();
    cy.get(selectors.razaoSocialInput).blur();

    cy.get(selectors.razaoSocialGridContainer)
      .find(".MuiFormHelperText-root")
      .should("contain.text", "Razão Social obrigatória")
      .and("have.class", "Mui-error");
  });

  it("deve ter limite máximo de 100 caracteres configurado", () => {
    cy.get(selectors.razaoSocialInput).should("have.attr", "maxlength", "100");
  });

  it("deve impedir entrada de mais de 100 caracteres", () => {
    const texto100 = "a".repeat(100);
    const textoExtra = "bcdef";

    cy.get(selectors.razaoSocialInput).type(texto100);
    cy.get(selectors.razaoSocialInput).should("have.value", texto100);

    // Tenta digitar mais caracteres
    cy.get(selectors.razaoSocialInput).type(textoExtra);

    // Verifica que ainda tem apenas 100 caracteres
    cy.get(selectors.razaoSocialInput).should("have.value", texto100);
  });

  it("deve aceitar Razão Social válida sem mostrar erro", () => {
    cy.get(selectors.razaoSocialInput).type("Empresa Teste LTDA");
    cy.get(selectors.razaoSocialInput).blur();

    cy.get(selectors.razaoSocialGridContainer)
      .find(".MuiFormHelperText-root")
      .should("not.exist");
  });

  it("deve respeitar maxLength de 100 caracteres", () => {
    cy.get(selectors.razaoSocialInput).should("have.attr", "maxlength", "100");
  });
});
