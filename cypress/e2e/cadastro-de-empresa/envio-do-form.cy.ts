import { selectors } from "./shared/selectors";

describe("Envio do formulário", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");
    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

  const validFormData = {
    cnpj: "11222333000181",
    razaoSocial: "Empresa Teste LTDA",
    nomeFantasia: "Empresa Teste",
    cep: "01310100",
    estado: "SP",
    municipio: "São Paulo",
    logradouro: "Avenida Paulista",
    numero: "1000",
    complemento: "Sala 100",
  };

  it("deve desabilitar o botão durante o carregamento de dados da API do CNPJ", () => {
    cy.get(selectors.cnpjInput).type(validFormData.cnpj);
    // Durante a busca de dados, o botão deve ficar desabilitado
    cy.get(selectors.submitButton).should("be.disabled");
    // Após a busca terminar, o botão deve ser habilitado novamente
    cy.get(selectors.submitButton, { timeout: 10000 }).should(
      "not.be.disabled",
    );
  });

  it("deve submeter o formulário com dados válidos", () => {
    // Preenche todos os campos obrigatórios
    cy.get(selectors.cnpjInput).type(validFormData.cnpj);
    // Aguarda o carregamento dos dados automáticos
    cy.get(selectors.razaoSocialInput, { timeout: 10000 }).should(
      "not.be.disabled",
    );
    // Completa/ajusta campos que podem não vir da API
    cy.get(selectors.razaoSocialInput).clear().type(validFormData.razaoSocial);
    cy.get(selectors.nomeFantasiaInput)
      .clear()
      .type(validFormData.nomeFantasia);
    cy.get(selectors.cepInput).clear().type(validFormData.cep);
    cy.get(selectors.estadoInput).clear().type(validFormData.estado);
    cy.get(selectors.municipioInput).clear().type(validFormData.municipio);
    cy.get(selectors.logradouroInput).clear().type(validFormData.logradouro);
    cy.get(selectors.numeroInput).clear().type(validFormData.numero);
    cy.get(selectors.complementoInput).clear().type(validFormData.complemento);
    // Submete o formulário
    cy.get(selectors.submitButton).click();
    // Verifica se o botão fica desabilitado durante o envio
    cy.get(selectors.submitButton).should("be.disabled");
    // Como a action faz redirect para "/", verifica a navegação
    cy.url({ timeout: 10000 }).should("eq", `${Cypress.config().baseUrl}/`);
  });

  it("não deve submeter o formulário com campos obrigatórios vazios", () => {
    // Tenta submeter sem preencher nada
    cy.get(selectors.submitButton).click();
    // Deve continuar na mesma página
    cy.url().should("include", "/cadastro-de-empresa");
    // Deve mostrar erros nos campos obrigatórios
    cy.get(selectors.cnpjGridContainer)
      .find(".MuiFormHelperText-root")
      .should("contain.text", "CNPJ obrigatório");
  });
});
