import { selectors } from "../shared/selectors";

describe("Modal de Receita Atual (CurrentRevenueDialog)", () => {
  beforeEach(() => {
    cy.visit("/");
    // Aguarda a página carregar completamente
    cy.get(selectors.companiesList).should("be.visible");
  });

  it("deve abrir a modal ao clicar no botão de receita", () => {
    // Clica no primeiro botão de receita
    cy.get(selectors.companyCard)
      .first()
      .within(() => cy.get(selectors.revenueDialogButton).click());

    // Verifica se a modal está visível
    cy.get(selectors.revenueDialog).should("be.visible");
  });

  it("deve exibir informações da empresa na modal", () => {
    // Captura o nome da empresa
    cy.get(selectors.companyCard)
      .first()
      .find(selectors.nomeFantasia)
      .invoke("text")
      .then((nomeEmpresa) => {
        // Abre a modal
        cy.get(selectors.companyCard)
          .first()
          .find(selectors.revenueDialogButton)
          .click();

        // Verifica se o nome aparece na modal
        cy.get(selectors.revenueDialog).should("be.visible");
        cy.get(selectors.revenueDialog).should("contain.text", nomeEmpresa);
      });
  });

  it("deve exibir valor de receita na modal", () => {
    cy.get(selectors.companyCard)
      .first()
      .within(() => cy.get(selectors.revenueDialogButton).click());

    cy.get(selectors.revenueDialog).should(($dialog) => {
      const text = $dialog.text();
      // Verifica se contém padrão de valor monetário brasileiro
      const hasMonetaryValue = /R\$|(\d{1,3}(\.\d{3})*,\d{2})|(\d+,\d{2})/.test(
        text,
      );
      expect(hasMonetaryValue).to.equal(true);
    });
  });

  it("deve fechar a modal ao clicar no botão fechar", () => {
    // Abre a modal
    cy.get(selectors.companyCard)
      .first()
      .within(() => {
        cy.get(selectors.revenueDialogButton).click();
      });

    cy.get(selectors.revenueDialog).should("be.visible");

    // Fecha a modal
    cy.get(selectors.revenueDialogClose).click();
    cy.get(selectors.revenueDialog).should("not.exist");
  });

  it("deve fechar a modal ao clicar fora dela (backdrop)", () => {
    // Abre a modal
    cy.get(selectors.companyCard)
      .first()
      .within(() => {
        cy.get(selectors.revenueDialogButton).click();
      });

    // Clica no backdrop
    cy.get(".MuiBackdrop-root").click({ force: true });
    cy.get(selectors.revenueDialog).should("not.exist");
  });

  it("deve fechar a modal ao pressionar ESC", () => {
    // Abre a modal
    cy.get(selectors.companyCard)
      .first()
      .within(() => {
        cy.get(selectors.revenueDialogButton).click();
      });

    // Pressiona ESC
    cy.get("body").type("{esc}");
    cy.get(selectors.revenueDialog).should("not.exist");
  });

  it("deve permitir abrir modais de diferentes empresas", () => {
    // Captura o nome da primeira empresa e testa
    cy.get(selectors.companyCard)
      .eq(0)
      .find(selectors.nomeFantasia)
      .invoke("text")
      .then((primeiraEmpresa) => {
        // Abre modal da primeira empresa
        cy.get(selectors.companyCard)
          .first()
          .within(() => {
            cy.get(selectors.revenueDialogButton).click();
          });

        cy.get(selectors.revenueDialog).should("contain.text", primeiraEmpresa);

        // Fecha
        cy.get(selectors.revenueDialogClose).click();

        // Agora captura e testa a segunda empresa
        cy.get(selectors.companyCard)
          .eq(1)
          .find(selectors.nomeFantasia)
          .invoke("text")
          .then((segundaEmpresa) => {
            // Abre modal da segunda empresa
            cy.get(selectors.companyCard)
              .eq(1)
              .within(() => {
                cy.get(selectors.revenueDialogButton).click();
              });

            cy.get(selectors.revenueDialog).should(
              "contain.text",
              segundaEmpresa,
            );
          });
      });
  });
});
