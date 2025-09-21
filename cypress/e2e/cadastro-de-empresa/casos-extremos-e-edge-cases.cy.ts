import { selectors } from "../shared/selectors";

describe("Casos extremos e edge cases", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");

    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

  it("deve lidar com entrada rápida de dados", () => {
    // Simula digitação muito rápida
    cy.get(selectors.cnpjInput).type("11222333000181", { delay: 0 });
    cy.get(selectors.cnpjInput).should("have.value", "11.222.333/0001-81");
  });

  it("deve lidar com múltiplas operações de clear", () => {
    cy.get(selectors.cnpjInput).type("11222333");
    cy.get(selectors.cnpjInput).clear();
    cy.get(selectors.cnpjInput).type("44555666");
    cy.get(selectors.cnpjInput).clear();
    cy.get(selectors.cnpjInput).type("11222333000181");

    cy.get(selectors.cnpjInput).should("have.value", "11.222.333/0001-81");
  });

  it("deve manter estado após perder e recuperar foco", () => {
    cy.get(selectors.cnpjInput).type("11222333");
    cy.get(selectors.cnpjInput).should("have.value", "11.222.333");

    // Perde o foco
    cy.get(selectors.pageTitle).click();

    // Recupera o foco
    cy.get(selectors.cnpjInput).focus();
    cy.get(selectors.cnpjInput).should("have.value", "11.222.333");
  });
});
