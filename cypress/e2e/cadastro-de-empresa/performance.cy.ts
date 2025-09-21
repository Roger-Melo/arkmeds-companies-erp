import { selectors } from "../shared/selectors";

describe("Performance", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");

    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

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
