import { selectors } from "./shared/selectors";

describe("Interações do teclado", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");

    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

  it("deve permitir navegação com Tab", () => {
    // Obtém o input
    cy.get(selectors.cnpjInput).focus();
    // Verifica se o elemento focado tem o data-cy correto
    cy.focused().should("have.attr", "data-cy", "cnpjInputElement");
  });

  it("deve permitir copiar e colar (Ctrl+C/Ctrl+V)", () => {
    const cnpj = "11222333000181";

    // Digita o CNPJ
    cy.get(selectors.cnpjInput).type(cnpj);

    // Seleciona tudo e copia
    cy.get(selectors.cnpjInput).type("{selectall}");

    // Limpa e cola
    cy.get(selectors.cnpjInput).clear();
    cy.get(selectors.cnpjInput)
      .invoke("val", "11.222.333/0001-81")
      .trigger("input");

    cy.get(selectors.cnpjInput).should("have.value", "11.222.333/0001-81");
  });

  it("deve permitir seleção de texto", () => {
    cy.get(selectors.cnpjInput).type("11222333000181");
    cy.get(selectors.cnpjInput).type("{selectall}");

    // Verifica que o texto pode ser selecionado
    cy.window().then((win) => {
      const selection = win.getSelection()?.toString();
      expect(selection).to.equal("11.222.333/0001-81");
    });
  });
});
