import { selectors } from "../../shared/selectors";

describe("Validação no momento do envio do form", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");
    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

  it("deve validar CNPJ inválido ao submeter", () => {
    // Preenche com CNPJ inválido
    cy.get(selectors.cnpjInput).type("11111111111111");

    // Preenche outros campos para garantir que só o CNPJ está errado
    cy.get(selectors.razaoSocialInput).type("Empresa Teste");
    cy.get(selectors.nomeFantasiaInput).type("Teste");
    cy.get(selectors.cepInput).type("01310100");
    cy.get(selectors.estadoInput).type("SP");
    cy.get(selectors.municipioInput).type("São Paulo");
    cy.get(selectors.logradouroInput).type("Rua Teste");
    cy.get(selectors.numeroInput).type("100");

    // Tenta submeter
    cy.get(selectors.submitButton).click();

    // Deve permanecer na página
    cy.url().should("include", "/cadastro-de-empresa");

    // Deve mostrar erro no CNPJ
    cy.get(selectors.cnpjGridContainer)
      .find(".MuiFormHelperText-root")
      .should("contain.text", "CNPJ inválido");
  });

  it("não deve permitir submit com campos obrigatórios vazios", () => {
    cy.visit("/cadastro-de-empresa");
    // Clica direto no botão sem preencher nada
    cy.get(selectors.submitButton).click();
    // Deve permanecer na página
    cy.url().should("include", "/cadastro-de-empresa");
    // Verifica que os erros aparecem para TODOS os campos obrigatórios
    const camposObrigatorios = [
      { selector: selectors.cnpjGridContainer, erro: "CNPJ obrigatório" },
      {
        selector: selectors.razaoSocialGridContainer,
        erro: "Razão Social obrigatória",
      },
      {
        selector: selectors.nomeFantasiaGridContainer,
        erro: "Nome Fantasia obrigatório",
      },
      { selector: selectors.cepGridContainer, erro: "CEP obrigatório" },
      { selector: selectors.estadoGridContainer, erro: "Estado obrigatório" },
      {
        selector: selectors.municipioGridContainer,
        erro: "Município obrigatório",
      },
      {
        selector: selectors.logradouroGridContainer,
        erro: "Logradouro obrigatório",
      },
    ];

    camposObrigatorios.forEach(({ selector, erro }) => {
      cy.get(selector)
        .find(".MuiFormHelperText-root")
        .should("contain.text", erro);
    });
  });

  it("deve impedir submit enquanto houver erros de validação", () => {
    cy.visit("/cadastro-de-empresa");
    // Preenche com CNPJ inválido
    cy.get(selectors.cnpjInput).type("11111111111111");
    // Preenche os outros campos corretamente
    cy.get(selectors.razaoSocialInput).type("Empresa Teste");
    cy.get(selectors.nomeFantasiaInput).type("Teste");
    cy.get(selectors.cepInput).type("01310100");
    cy.get(selectors.estadoInput).type("SP");
    cy.get(selectors.municipioInput).type("São Paulo");
    cy.get(selectors.logradouroInput).type("Rua Teste");
    cy.get(selectors.numeroInput).type("100");
    // Verifica que o erro do CNPJ está visível
    cy.get(selectors.cnpjGridContainer)
      .find(".MuiFormHelperText-root")
      .should("contain.text", "CNPJ inválido")
      .and("have.class", "Mui-error");
    // Tenta submeter
    cy.get(selectors.submitButton).click();
    // Deve permanecer na página (não deve redirecionar)
    cy.url().should("include", "/cadastro-de-empresa");
    // O erro do CNPJ deve continuar visível
    cy.get(selectors.cnpjGridContainer)
      .find(".MuiFormHelperText-root")
      .should("contain.text", "CNPJ inválido");
  });
});
