import { selectors } from "./shared/selectors";

describe("Estado do botão de envio do form", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");

    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

  it("deve manter botão desabilitado enquanto houver loading de CNPJ e durante submissão", () => {
    // Durante busca de CNPJ
    cy.get(selectors.cnpjInput).type("34028316000103");
    cy.get(selectors.submitButton).should("be.disabled");

    // Após busca terminar
    cy.get(selectors.submitButton, { timeout: 10000 }).should(
      "not.be.disabled",
    );

    // Preenche campos restantes
    cy.get(selectors.razaoSocialInput).should("not.have.value", "");

    // Durante submissão
    cy.get(selectors.submitButton).click();
    cy.get(selectors.submitButton).should("be.disabled");
  });

  it("deve exibir estilos corretos no botão quando desabilitado", () => {
    cy.get(selectors.cnpjInput).type("34028316000103");

    // Durante loading, verifica estilo desabilitado
    cy.get(selectors.submitButton)
      .should("be.disabled")
      .and("have.css", "opacity", "0.6");
  });
});
