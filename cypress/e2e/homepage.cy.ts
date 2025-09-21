import { selectors } from "./shared/selectors";

describe("Homepage - Listagem de Empresas e Modal de Receita", () => {
  beforeEach(() => {
    cy.visit("/");
    // Aguarda a página carregar completamente
    cy.get(selectors.companiesList).should("be.visible");
  });

  describe("Fluxo completo: Listagem → Paginação → Modal", () => {
    it("deve completar o fluxo de navegação e visualização de receita", () => {
      // 1. Verifica listagem inicial
      cy.get(selectors.companiesList).should("be.visible");
      cy.get(selectors.companyCard).should("have.length.greaterThan", 0);

      // 2. Se houver paginação, navega para página 2
      cy.get("body").then(($body) => {
        if ($body.find(selectors.nextPageButton).length > 0) {
          cy.get(selectors.nextPageButton).click();
          cy.url().should("include", "page=2");
          cy.get(selectors.companiesList).should("be.visible");
        }
      });

      // 3. Abre modal de uma empresa
      cy.get(selectors.companyCard)
        .first()
        .within(() => {
          cy.get(selectors.revenueDialogButton).click();
        });

      // 4. Verifica modal
      cy.get(selectors.revenueDialog).should("be.visible");

      // 5. Fecha modal
      cy.get(selectors.revenueDialogClose).click();
      cy.get(selectors.revenueDialog).should("not.exist");

      // 6. Se estava na página 2, volta para primeira página
      cy.url().then((url) => {
        if (url.includes("page=2")) {
          cy.get(selectors.previousPageButton).click();
          cy.url().should("not.include", "page=");
        }
      });

      // 7. Verifica que está mostrando cards
      cy.get(selectors.companyCard).should("have.length.greaterThan", 0);
    });

    it("deve manter estado da página após abrir e fechar modal", () => {
      cy.get("body").then(($body) => {
        if ($body.find(selectors.nextPageButton).length > 0) {
          // Vai para página 2
          cy.get(selectors.nextPageButton).click();
          cy.url().should("include", "page=2");

          // Captura primeiro card da página 2
          cy.get(selectors.companyCard)
            .first()
            .find(selectors.nomeFantasia)
            .invoke("text")
            .then((nomeEmpresa) => {
              // Abre modal
              cy.get(selectors.companyCard)
                .first()
                .within(() => {
                  cy.get(selectors.revenueDialogButton).click();
                });

              // Fecha modal
              cy.get(selectors.revenueDialogClose).click();

              // Verifica se ainda está na página 2
              cy.url().should("include", "page=2");

              // Verifica se o mesmo card ainda está visível
              cy.get(selectors.companyCard)
                .first()
                .should("contain.text", nomeEmpresa);
            });
        }
      });
    });
  });
});
