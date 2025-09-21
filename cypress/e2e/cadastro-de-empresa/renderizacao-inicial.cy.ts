import { selectors } from "../shared/selectors";

describe("Cadastro de Empresa - Renderização inicial", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");
    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

  it("deve renderizar o título da página corretamente", () => {
    cy.get(selectors.pageTitle)
      .should("be.visible")
      .and("contain.text", "Cadastro de Empresa");
  });

  it("deve renderizar o formulário de cadastro", () => {
    cy.get(selectors.companyForm).should("be.visible");
  });

  it("deve renderizar a seção 'Dados da Empresa'", () => {
    cy.get(selectors.companyDataSection)
      .should("be.visible")
      .and("contain.text", "Dados da Empresa");
  });

  it("deve renderizar o campo CNPJ com placeholder correto", () => {
    cy.get(selectors.cnpjInput)
      .should("be.visible")
      .and("have.attr", "placeholder", "00000000000000");
  });

  it("deve exibir helper text inicial", () => {
    cy.get(selectors.cnpjGridContainer)
      .find(".MuiFormHelperText-root")
      .should("be.visible")
      .and("contain.text", "Digite apenas os números");
  });

  it("deve renderizar o Paper com elevation correto", () => {
    cy.get(".MuiPaper-root").should("have.class", "MuiPaper-elevation3");
  });

  it("deve ter o campo CNPJ vazio inicialmente", () => {
    cy.get(selectors.cnpjInput).should("have.value", "");
  });

  it("deve renderizar o campo Razão Social com placeholder correto", () => {
    cy.get(selectors.razaoSocialInput)
      .should("be.visible")
      .and("have.attr", "placeholder", "Digite a razão social da empresa");
  });

  it("deve ter o campo Razão Social vazio inicialmente", () => {
    cy.get(selectors.razaoSocialInput).should("have.value", "");
  });

  it("deve renderizar o campo Razão Social sem estar desabilitado inicialmente", () => {
    cy.get(selectors.razaoSocialInput).should("not.be.disabled");
  });

  it("deve renderizar o campo Nome Fantasia com placeholder correto", () => {
    cy.get(selectors.nomeFantasiaInput)
      .should("be.visible")
      .and("have.attr", "placeholder", "Digite o nome fantasia da empresa");
  });

  it("deve ter o campo Nome Fantasia vazio inicialmente", () => {
    cy.get(selectors.nomeFantasiaInput).should("have.value", "");
  });

  it("deve renderizar o campo Nome Fantasia sem estar desabilitado inicialmente", () => {
    cy.get(selectors.nomeFantasiaInput).should("not.be.disabled");
  });

  it("deve renderizar a seção 'Endereço da Empresa'", () => {
    cy.get(selectors.companyAddressSection)
      .should("be.visible")
      .and("contain.text", "Endereço da Empresa");
  });

  it("deve renderizar o campo CEP com placeholder correto", () => {
    cy.get(selectors.cepInput)
      .should("be.visible")
      .and("have.attr", "placeholder", "00000000");
  });

  it("deve ter o campo CEP vazio inicialmente", () => {
    cy.get(selectors.cepInput).should("have.value", "");
  });

  it("deve renderizar o campo CEP sem estar desabilitado inicialmente", () => {
    cy.get(selectors.cepInput).should("not.be.disabled");
  });

  it("deve exibir helper text inicial para CEP", () => {
    cy.get(selectors.cepHelperText)
      .should("be.visible")
      .and("contain.text", "Digite apenas os números");
  });

  it("deve renderizar o campo Estado com placeholder correto", () => {
    cy.get(selectors.estadoInput)
      .should("be.visible")
      .and("have.attr", "placeholder", "UF");
  });

  it("deve ter o campo Estado vazio inicialmente", () => {
    cy.get(selectors.estadoInput).should("have.value", "");
  });

  it("deve renderizar o campo Estado sem estar desabilitado inicialmente", () => {
    cy.get(selectors.estadoInput).should("not.be.disabled");
  });

  it("deve exibir helper text inicial para Estado", () => {
    cy.get(selectors.estadoHelperText)
      .should("be.visible")
      .and("contain.text", "Digite a sigla do estado (UF)");
  });

  it("deve renderizar o campo Município com placeholder correto", () => {
    cy.get(selectors.municipioInput)
      .should("be.visible")
      .and("have.attr", "placeholder", "Digite o nome do município");
  });

  it("deve ter o campo Município vazio inicialmente", () => {
    cy.get(selectors.municipioInput).should("have.value", "");
  });

  it("deve renderizar o campo Município sem estar desabilitado inicialmente", () => {
    cy.get(selectors.municipioInput).should("not.be.disabled");
  });

  it("deve renderizar o campo Logradouro com placeholder correto", () => {
    cy.get(selectors.logradouroInput)
      .should("be.visible")
      .and("have.attr", "placeholder", "Digite o logradouro");
  });

  it("deve ter o campo Logradouro vazio inicialmente", () => {
    cy.get(selectors.logradouroInput).should("have.value", "");
  });

  it("deve renderizar o campo Logradouro sem estar desabilitado inicialmente", () => {
    cy.get(selectors.logradouroInput).should("not.be.disabled");
  });

  it("deve renderizar o campo Número com placeholder correto", () => {
    cy.get(selectors.numeroInput)
      .should("be.visible")
      .and("have.attr", "placeholder", "Digite o número ou S/N");
  });

  it("deve ter o campo Número vazio inicialmente", () => {
    cy.get(selectors.numeroInput).should("have.value", "");
  });

  it("deve renderizar o campo Número sem estar desabilitado inicialmente", () => {
    cy.get(selectors.numeroInput).should("not.be.disabled");
  });

  it("deve exibir helper text inicial para Número", () => {
    cy.get(selectors.numeroHelperText)
      .should("be.visible")
      .and("contain.text", "Aceita número inteiro positivo ou 'S/N'");
  });

  it("deve renderizar o campo Complemento com placeholder correto", () => {
    cy.get(selectors.complementoInput)
      .should("be.visible")
      .and(
        "have.attr",
        "placeholder",
        "Apartamento, sala, bloco, etc. (opcional)",
      );
  });

  it("deve ter o campo Complemento vazio inicialmente", () => {
    cy.get(selectors.complementoInput).should("have.value", "");
  });

  it("deve renderizar o campo Complemento sem estar desabilitado inicialmente", () => {
    cy.get(selectors.complementoInput).should("not.be.disabled");
  });

  it("deve exibir helper text inicial para Complemento", () => {
    cy.get(selectors.complementoHelperText)
      .should("be.visible")
      .and("contain.text", "Campo opcional");
  });

  it("deve renderizar o botão de cadastrar empresa", () => {
    cy.get(selectors.submitButton)
      .should("be.visible")
      .and("contain.text", "Cadastrar Empresa")
      .and("not.be.disabled");
  });

  it("deve ter o botão com tipo submit", () => {
    cy.get(selectors.submitButton).should("have.attr", "type", "submit");
  });
});
