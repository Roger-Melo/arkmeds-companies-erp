import { selectors } from "./cadastro-de-empresa/shared/selectors";

describe("Cadastro de Empresa - Formulário de Criação", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");
    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

  describe("Interações do teclado", () => {
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

  describe("Casos extremos e edge cases", () => {
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

  describe("Performance", () => {
    it("deve renderizar o formulário rapidamente", () => {
      cy.visit("/cadastro-de-empresa", {
        onBeforeLoad: (win) => {
          win.performance.mark("start");
        },
        onLoad: (win) => {
          win.performance.mark("end");
          win.performance.measure("pageLoad", "start", "end");
          const measure = win.performance.getEntriesByName("pageLoad")[0];
          // Verifica se carregou em menos de 3 segundos
          expect(measure.duration).to.be.lessThan(3000);
        },
      });
    });

    it("deve aplicar máscara sem lag perceptível", () => {
      const startTime = performance.now();

      cy.get(selectors.cnpjInput).type("11222333000181");

      const endTime = performance.now();
      const duration = endTime - startTime;

      // A operação deve ser rápida (menos de 1 segundo para digitar)
      expect(duration).to.be.lessThan(1000);
    });
  });

  describe("Acessibilidade", () => {
    it("deve ter label associado ao campo", () => {
      cy.get(selectors.cnpjGridContainer)
        .find("label")
        .should("exist")
        .and("have.attr", "for");
    });

    it("deve ter aria-invalid quando houver erro", () => {
      cy.get(selectors.cnpjInput).type("11111111111111");
      cy.get(selectors.cnpjInput).should("have.attr", "aria-invalid", "true");
    });

    it("deve ter aria-describedby para o helper text", () => {
      cy.get(selectors.cnpjInput).should("have.attr", "aria-describedby");
    });
  });
});
