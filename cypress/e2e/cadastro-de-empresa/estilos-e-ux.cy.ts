import { selectors } from "../shared/selectors";

describe("Estilos e UX", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");

    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

  it("deve aplicar cor customizada no focus do campo", () => {
    cy.get(selectors.cnpjInputElement).focus();
    cy.get(selectors.cnpjGridContainer)
      .find(".MuiOutlinedInput-root")
      .should("have.class", "Mui-focused")
      .find("fieldset")
      .should("have.css", "border-color");
  });

  it("deve aplicar cor de erro quando inválido", () => {
    cy.get(selectors.cnpjInput).type("11111111111111");
    cy.get(
      `${selectors.cnpjInput.replace(" input", "")} .MuiOutlinedInput-root`,
    ).should("have.class", "Mui-error");
  });

  it("deve respeitar maxLength de 18 caracteres", () => {
    // 14 dígitos + 4 caracteres de formatação = 18
    cy.get(selectors.cnpjInput).should("have.attr", "maxlength", "18");
  });

  it("deve ser responsivo em diferentes tamanhos de tela", () => {
    // Desktop
    cy.viewport(1920, 1080);
    cy.get(selectors.cnpjGridContainer).should(
      "have.class",
      "MuiGrid-grid-sm-6",
    );

    // Mobile
    cy.viewport(375, 667);
    cy.get(selectors.cnpjGridContainer).should(
      "have.class",
      "MuiGrid-grid-xs-12",
    );
  });

  // Função auxiliar para testar responsividade
  function testResponsiveness(fieldName: string, selector: string) {
    it(`deve ser responsivo para campo ${fieldName}`, () => {
      // Desktop
      cy.viewport(1920, 1080);
      cy.get(selector).should("have.class", "MuiGrid-grid-sm-6");
      // Mobile
      cy.viewport(375, 667);
      cy.get(selector).should("have.class", "MuiGrid-grid-xs-12");
    });
  }

  // Lista de campos para testar
  const fieldsToTest = [
    { name: "Razão Social", selector: selectors.razaoSocialGridContainer },
    { name: "Nome Fantasia", selector: selectors.nomeFantasiaGridContainer },
    { name: "CEP", selector: selectors.cepGridContainer },
    { name: "Estado", selector: selectors.estadoGridContainer },
    { name: "Município", selector: selectors.municipioGridContainer },
    { name: "Logradouro", selector: selectors.logradouroGridContainer },
    { name: "Número", selector: selectors.numeroGridContainer },
    { name: "Complemento", selector: selectors.complementoGridContainer },
  ];

  // Executa os testes
  fieldsToTest.forEach((field) => {
    testResponsiveness(field.name, field.selector);
  });
});
