import { selectors } from "../shared/selectors";
import { invalidCNPJs, validCNPJs } from "../shared/test-data";

describe("Cadastro de Empresa - Validação de CNPJ", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");
    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

  it("deve mostrar erro para CNPJ incompleto", () => {
    cy.get(selectors.cnpjInput).type("1122233300");
    cy.get(selectors.cnpjInput).blur();

    cy.get(selectors.cnpjHelperText)
      .should("contain.text", "O CNPJ deve ter 14 dígitos")
      .and("have.class", "Mui-error");
  });

  it("deve mostrar erro para CNPJ com todos dígitos iguais", () => {
    cy.get(selectors.cnpjInput).type(invalidCNPJs.allSameDigits);
    cy.get(selectors.cnpjInput).blur();

    cy.get(selectors.cnpjHelperText)
      .should("contain.text", "CNPJ inválido")
      .and("have.class", "Mui-error");
  });

  it("deve mostrar erro para CNPJ com dígito verificador incorreto", () => {
    cy.get(selectors.cnpjInput).type(invalidCNPJs.wrongCheckDigit);
    cy.get(selectors.cnpjInput).blur();

    cy.get(selectors.cnpjHelperText)
      .should("contain.text", "CNPJ inválido")
      .and("have.class", "Mui-error");
  });

  it("deve aceitar CNPJ válido sem mostrar erro", () => {
    cy.get(selectors.cnpjInput).type(validCNPJs.unformatted);
    cy.get(selectors.cnpjInput).blur();

    cy.get(selectors.cnpjHelperText)
      .should("not.have.class", "Mui-error")
      .and("contain.text", "Digite apenas os números");
  });

  it("deve validar em tempo real (modo onChange)", () => {
    // Digite um CNPJ inválido
    cy.get(selectors.cnpjInput).type("11222333000180");

    // Sem precisar blur, já deve mostrar erro
    cy.get(selectors.cnpjHelperText)
      .should("contain.text", "CNPJ inválido")
      .and("have.class", "Mui-error");

    // Corrige o último dígito
    cy.get(selectors.cnpjInput).type("{backspace}1");

    // Erro deve sumir
    cy.get(selectors.cnpjHelperText).should("not.have.class", "Mui-error");
  });

  it("deve mostrar erro de campo obrigatório quando vazio após interação", () => {
    cy.get(selectors.cnpjInput).type("1").clear();
    cy.get(selectors.cnpjInput).blur();

    cy.get(selectors.cnpjHelperText)
      .should("contain.text", "CNPJ obrigatório")
      .and("have.class", "Mui-error");
  });
});
