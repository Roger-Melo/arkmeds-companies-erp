import { selectors } from "./shared/selectors";
import { formFields, cnpjTeste } from "./shared/test-data";

describe("Integração com API de CNPJ", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");
    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

  it("deve buscar e preencher dados da empresa ao inserir CNPJ válido", () => {
    cy.get(selectors.cnpjInput).type(cnpjTeste.numero);

    // Aguarda o campo Razão Social ser preenchido (timeout maior para chamada real)
    cy.get(selectors.razaoSocialInput, { timeout: 10000 })
      .should("not.have.value", "")
      .and("not.be.disabled");

    // Verifica se algum valor foi preenchido
    cy.get(selectors.razaoSocialInput)
      .invoke("val")
      .should("have.length.greaterThan", 0);
  });

  describe("Preenchimento automático de campos", () => {
    formFields.forEach((field) => {
      it(`deve preencher o campo ${field.name} automaticamente quando disponível`, () => {
        // Preenche o campo de CNPJ
        cy.get(selectors.cnpjInput).type(field.cnpjToTest);

        // Aguarda o campo em questão ser preenchido
        cy.get(field.selector, { timeout: 10000 })
          .should("not.have.value", "")
          .and("not.be.disabled");

        // Validação específica baseada no tipo de campo
        if (field.expectedValueType === "non-empty") {
          cy.get(field.selector)
            .invoke("val")
            .should("have.length.greaterThan", 0);
        } else if (field.expectedValueType === "have-hyphen") {
          cy.get(field.selector).invoke("val").should("include", "-");
        } else if (field.expectedValueType === "exact-length") {
          cy.get(field.selector)
            .invoke("val")
            .should("have.length", field.expectedLength);
        }
      });
    });
  });

  describe("Indicadores de loading", () => {
    formFields.forEach((field) => {
      it(`deve mostrar loading no campo ${field.name} durante busca`, () => {
        cy.get(selectors.cnpjInput).type(field.cnpjToTest);

        // Verifica loading text
        cy.get(field.containerSelector)
          .find(".MuiFormHelperText-root")
          .should("contain.text", "Buscando dados da empresa...");

        // Verifica spinner
        cy.get(field.containerSelector)
          .find(".MuiCircularProgress-root")
          .should("exist");

        // Aguarda loading terminar
        cy.get(field.selector, { timeout: 10000 }).should("not.be.disabled");

        // Verifica que loading sumiu
        cy.get(field.containerSelector)
          .find(".MuiCircularProgress-root")
          .should("not.exist");
      });
    });
  });

  describe("Estado dos campos durante busca", () => {
    formFields.forEach((field) => {
      it(`deve desabilitar ${field.name} durante busca e habilitar depois`, () => {
        cy.get(field.selector).should("not.be.disabled");
        cy.get(selectors.cnpjInput).type(field.cnpjToTest);
        cy.get(field.selector).should("be.disabled");
        cy.get(field.selector, { timeout: 10000 }).should("not.be.disabled");
      });
    });
  });

  describe("Edição manual após preenchimento automático", () => {
    formFields.forEach((field) => {
      it(`deve permitir edição manual do ${field.name} após preenchimento automático`, () => {
        cy.get(selectors.cnpjInput).type(field.cnpjToTest);

        cy.get(field.selector, { timeout: 10000 })
          .should("not.have.value", "")
          .and("not.be.disabled");

        cy.get(field.selector).clear().type(field.newManualValue);

        const expectedValue = field.expectedManualValue ?? field.newManualValue;
        cy.get(field.selector).should("have.value", expectedValue);
      });
    });
  });

  it("não deve fazer chamada à API para CNPJ inválido", () => {
    // Digita CNPJ inválido
    cy.get(selectors.cnpjInput).type("11111111111111");

    // Aguarda para garantir que não houve chamada
    cy.wait(2000);

    // Simplesmente verifica que o campo continua vazio e habilitado
    cy.get(selectors.razaoSocialInput)
      .should("have.value", "")
      .should("not.be.disabled");

    // Verifica que não há spinner de loading
    cy.get(".MuiCircularProgress-root").should("not.exist");
  });

  it("deve buscar dados apenas uma vez por CNPJ válido", () => {
    // Digite o CNPJ
    cy.get(selectors.cnpjInput).type(cnpjTeste.numero);

    // Aguarda o primeiro preenchimento
    cy.get(selectors.razaoSocialInput, { timeout: 10000 }).should(
      "not.have.value",
      "",
    );

    // Armazena o valor preenchido
    cy.get(selectors.razaoSocialInput)
      .invoke("val")
      .then((valorPreenchido) => {
        // Adiciona e remove um dígito (não deve buscar novamente)
        cy.get(selectors.cnpjInput).type("9");
        cy.get(selectors.cnpjInput).type("{backspace}");

        // Aguarda um pouco
        cy.wait(1000);

        // Verifica que não apareceu loading novamente
        cy.get(selectors.razaoSocialGridContainer)
          .find(".MuiCircularProgress-root")
          .should("not.exist");

        // Valor deve permanecer o mesmo
        cy.get(selectors.razaoSocialInput).should(
          "have.value",
          valorPreenchido,
        );
      });
  });

  it("deve lidar com timeout ou erro de rede graciosamente", () => {
    // Este teste depende do comportamento da API real
    // Se a API estiver fora do ar ou lenta, o campo deve permanecer editável

    // Usa um CNPJ válido
    cy.get(selectors.cnpjInput).type(cnpjTeste.numero);

    // Mesmo que a API falhe, o campo deve eventualmente ficar habilitado
    // (após timeout ou erro)
    cy.get(selectors.razaoSocialInput, { timeout: 15000 }).should(
      "not.be.disabled",
    );

    // O usuário deve poder digitar manualmente se necessário
    cy.get(selectors.razaoSocialInput)
      .should("not.be.disabled")
      .type("{selectall}Digitado Manualmente")
      .should("have.value", "Digitado Manualmente");
  });
});
