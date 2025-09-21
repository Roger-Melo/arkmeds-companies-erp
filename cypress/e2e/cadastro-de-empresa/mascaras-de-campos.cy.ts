import { selectors } from "../shared/selectors";

describe("Cadastro de Empresa - Máscaras", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");
    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

  describe("Máscara de CEP", () => {
    it("deve aplicar máscara progressivamente ao digitar", () => {
      const cep = "01310100";

      cy.get(selectors.cepInput).type("01310");
      cy.get(selectors.cepInput).should("have.value", "01310");

      cy.get(selectors.cepInput).type("1");
      cy.get(selectors.cepInput).should("have.value", "01310-1");

      cy.get(selectors.cepInput).clear().type(cep);
      cy.get(selectors.cepInput).should("have.value", "01310-100");
    });

    it("deve limitar a 8 dígitos", () => {
      const cepComExcesso = "013101009999";

      cy.get(selectors.cepInput).type(cepComExcesso);
      cy.get(selectors.cepInput).should("have.value", "01310-100");
    });

    it("deve aceitar apenas números", () => {
      cy.get(selectors.cepInput).type("abc01310def100ghi");
      cy.get(selectors.cepInput).should("have.value", "01310-100");
    });

    it("deve manter a máscara ao deletar caracteres", () => {
      cy.get(selectors.cepInput).type("01310100");
      cy.get(selectors.cepInput).should("have.value", "01310-100");

      cy.get(selectors.cepInput).type("{backspace}");
      cy.get(selectors.cepInput).should("have.value", "01310-10");

      cy.get(selectors.cepInput).type("{backspace}");
      cy.get(selectors.cepInput).should("have.value", "01310-1");

      cy.get(selectors.cepInput).type("{backspace}");
      cy.get(selectors.cepInput).should("have.value", "01310");
    });
  });

  describe("Máscara de CNPJ", () => {
    it("deve aplicar máscara progressivamente ao digitar", () => {
      const cnpj = "11222333000181";

      // Testa cada etapa da máscara
      cy.get(selectors.cnpjInput).type("11");
      cy.get(selectors.cnpjInput).should("have.value", "11");

      cy.get(selectors.cnpjInput).type("2");
      cy.get(selectors.cnpjInput).should("have.value", "11.2");

      cy.get(selectors.cnpjInput).clear().type("11222");
      cy.get(selectors.cnpjInput).should("have.value", "11.222");

      cy.get(selectors.cnpjInput).type("3");
      cy.get(selectors.cnpjInput).should("have.value", "11.222.3");

      cy.get(selectors.cnpjInput).clear().type("11222333");
      cy.get(selectors.cnpjInput).should("have.value", "11.222.333");

      cy.get(selectors.cnpjInput).type("0");
      cy.get(selectors.cnpjInput).should("have.value", "11.222.333/0");

      cy.get(selectors.cnpjInput).clear().type("112223330001");
      cy.get(selectors.cnpjInput).should("have.value", "11.222.333/0001");

      cy.get(selectors.cnpjInput).type("8");
      cy.get(selectors.cnpjInput).should("have.value", "11.222.333/0001-8");

      cy.get(selectors.cnpjInput).clear().type(cnpj);
      cy.get(selectors.cnpjInput).should("have.value", "11.222.333/0001-81");
    });

    it("deve limitar a 14 dígitos", () => {
      const cnpjComExcesso = "112223330001819999";

      cy.get(selectors.cnpjInput).type(cnpjComExcesso);
      cy.get(selectors.cnpjInput).should("have.value", "11.222.333/0001-81");
    });

    it("deve aceitar apenas números", () => {
      cy.get(selectors.cnpjInput).type("abc11def222ghi333jkl0001mn81op");
      cy.get(selectors.cnpjInput).should("have.value", "11.222.333/0001-81");
    });

    it("deve manter a máscara ao deletar caracteres", () => {
      cy.get(selectors.cnpjInput).type("11222333000181");
      cy.get(selectors.cnpjInput).should("have.value", "11.222.333/0001-81");

      // Remove o último dígito
      cy.get(selectors.cnpjInput).type("{backspace}");
      cy.get(selectors.cnpjInput).should("have.value", "11.222.333/0001-8");

      // Remove mais um
      cy.get(selectors.cnpjInput).type("{backspace}");
      cy.get(selectors.cnpjInput).should("have.value", "11.222.333/0001");
    });
  });
});
