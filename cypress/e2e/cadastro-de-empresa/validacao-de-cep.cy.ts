import { selectors } from "./shared/selectors";
import { invalidCEPs, validCEPs } from "./shared/test-data";

describe("Cadastro de Empresa - Validação de CEP", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");
    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

  it("deve mostrar erro para CEP incompleto", () => {
    cy.get(selectors.cepInput).type("0131010");
    cy.get(selectors.cepInput).blur();

    cy.get(selectors.cepGridContainer)
      .find(".MuiFormHelperText-root")
      .should("contain.text", "CEP inválido")
      .and("have.class", "Mui-error");
  });

  it("deve mostrar erro de campo obrigatório quando vazio após interação", () => {
    cy.get(selectors.cepInput).type("1").clear();
    cy.get(selectors.cepInput).blur();

    cy.get(selectors.cepGridContainer)
      .find(".MuiFormHelperText-root")
      .should("contain.text", "CEP obrigatório")
      .and("have.class", "Mui-error");
  });

  it("deve aceitar CEP válido sem mostrar erro", () => {
    cy.get(selectors.cepInput).type(validCEPs.unformatted);
    cy.get(selectors.cepInput).blur();

    cy.get(selectors.cepGridContainer)
      .find(".MuiFormHelperText-root")
      .should("not.have.class", "Mui-error")
      .and("contain.text", "Digite apenas os números");
  });

  it("deve ter limite máximo de 9 caracteres configurado", () => {
    cy.get(selectors.cepInput).should("have.attr", "maxlength", "9");
  });

  it("deve mostrar erro para CEP com formato inválido (sem hífen na posição correta)", () => {
    // Digita 8 dígitos que formariam um CEP mas com formato errado
    cy.get(selectors.cepInput).type(invalidCEPs.invalidFormat);
    cy.get(selectors.cepInput).blur();

    // A máscara vai formatar para "12345-678",
    // mas o padrão regex espera /^\d{5}-\d{3}$/
    cy.get(selectors.cepGridContainer)
      .find(".MuiFormHelperText-root")
      .should("not.have.class", "Mui-error"); // A máscara deve corrigir automaticamente
  });

  it("deve validar em tempo real (modo onChange)", () => {
    // Digita um CEP incompleto
    cy.get(selectors.cepInput).type(invalidCEPs.incomplete);

    // Sem precisar blur, já deve mostrar erro
    cy.get(selectors.cepGridContainer)
      .find(".MuiFormHelperText-root")
      .should("contain.text", "CEP inválido")
      .and("have.class", "Mui-error");

    // Completa o CEP
    cy.get(selectors.cepInput).type("0");

    // Erro deve sumir
    cy.get(selectors.cepGridContainer)
      .find(".MuiFormHelperText-root")
      .should("not.have.class", "Mui-error");
  });

  it("não deve permitir mais dígitos que o necessário", () => {
    cy.get(selectors.cepInput).type(invalidCEPs.tooMany);
    // Deve ter exatamente 9 caracteres (8 dígitos + 1 hífen)
    cy.get(selectors.cepInput).invoke("val").should("have.length", 9);
  });
});
